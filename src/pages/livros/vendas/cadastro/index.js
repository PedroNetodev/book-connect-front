import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import ReactLoading from 'react-loading';
import { formatDateForMySQL } from '../../../../utils/date';
import { parseCurrencyValue } from '../../../../utils/currency';

export default function VendasCadastro() {
  const router = useRouter();
  const { id_book, id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [preco, setPreco] = useState('');
  const [vendaOnline, setVendaOnline] = useState(false);
  const [valorFrete, setValorFrete] = useState('')
  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    estado: '',
    cidade: '',
  });
  const [enderecoId, setEnderecoId] = useState(null);

  useEffect(() => {
    // Fetch existing book details if id_book is present
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://book-connect-backend.vercel.app/api/livros/${id_book}`);
        const body = await response.json();
        setTitulo(body.titulo);
        setPreco(body.preco_estimado.toString());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
        setLoading(false);
      }
    };

    if (id_book) {
      fetchBook();
    }
  }, [id_book]);

  const handlePrecoChange = (values) => {
    const { value } = values;
    setPreco(value);
  };

  const handleValorFreteChange = (values) => {
    const { value } = values;
    setValorFrete(value);
  };

  const handleVendaOnlineChange = (event) => {
    const { value } = event.target;
    if (value === 'Sim') {
      setVendaOnline(true);
      setIsModalOpen(true);
    } else {
      setVendaOnline(false);
    }
  };

  const handleEnderecoChange = (event) => {
    const { name, value } = event.target;
    setEndereco((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveEnderecoAndCloseModal = async () => {
    try {
      const response = await fetch('https://book-connect-backend.vercel.app/api/enderecos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endereco),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar o endereço');
      }
      const result = await response.json();
      setEnderecoId(result.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar o endereço:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        valor: parseCurrencyValue(preco),
        cliente_id: null, // Ou um valor válido se necessário
        data_venda: formatDateForMySQL(new Date()),
        delivery: vendaOnline,
        valor_frete: vendaOnline ? parseCurrencyValue(valorFrete) : 0.00, // Substitua pelo valor correto do frete
        endereco_id: vendaOnline ? enderecoId : null,
        livro_id: id_book // Inclua o livro_id
      };

      const response = await fetch('https://book-connect-backend.vercel.app/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar a venda');
      }

      const result = await response.json();
      console.log('Venda registrada com sucesso:', result);
      router.push('/livros/vendas'); // Redirecionar para a página de vendas
    } catch (error) {
      console.error('Erro ao registrar a venda:', error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className='d-flex justify-content-center mt-5'>
      <ReactLoading type={"spin"} color={"black"} height={168} width={75} />
    </div>
  ) : (
    <div className='container border p-3 mt-3 col-md-3 col-sm-12'>
      <h2 className='mb-3 mt-2'>{id ? 'Editar' : 'Registrar'} Venda</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="vendaForm.titulo">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o título do livro"
            value={titulo}
            required
            onChange={(e) => setTitulo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="vendaForm.preco">
          <Form.Label>Preço</Form.Label>
          <NumericFormat
            prefix={"R$ "}
            decimalScale={2}
            placeholder="Valor estimado de venda"
            className='form-control'
            decimalSeparator=','
            value={preco}
            required
            onValueChange={handlePrecoChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Modo de venda</Form.Label>
          <div className='d-flex flex-row'>
            <Form.Check
              type="radio"
              label="Sim"
              name="vendaOnline"
              value="Sim"
              checked={vendaOnline === true}
              onChange={handleVendaOnlineChange}
              className='m-2'
            />
            <Form.Check
              type="radio"
              label="Não"
              name="vendaOnline"
              value="Não"
              checked={vendaOnline === false}
              onChange={handleVendaOnlineChange}
              className='m-2'
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="vendaForm.valor_frete" hidden={!vendaOnline}>
          <Form.Label>Valor frete</Form.Label>
          <NumericFormat
            prefix={"R$ "}
            decimalScale={2}
            placeholder="Valor de frete"
            className='form-control'
            decimalSeparator=','
            value={valorFrete}
            required
            onValueChange={handleValorFreteChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className='col-12'>
          {id ? 'Salvar Alterações' : 'Registrar Venda'}
        </Button>
      </Form>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Endereço da Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="endereco.rua">
              <Form.Label>Nome da Rua</Form.Label>
              <Form.Control
                type="text"
                name="rua"
                value={endereco.rua}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endereco.numero">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={endereco.numero}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endereco.cep">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={endereco.cep}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endereco.bairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                value={endereco.bairro}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endereco.estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="estado"
                value={endereco.estado}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endereco.cidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={endereco.cidade}
                required
                onChange={handleEnderecoChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={saveEnderecoAndCloseModal}>
            Salvar Endereço
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
