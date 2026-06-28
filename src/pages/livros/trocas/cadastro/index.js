import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { NumericFormat } from 'react-number-format';
import React, { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import ReactLoading from 'react-loading';
import { parseCurrencyValue } from '../../../../utils/currency';

export default function Troca() {
  const router = useRouter();
  const { id_livro_oferecido } = router.query;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [precoCompra, setPrecoCompra] = useState(0);
  const [precoVenda, setPrecoVenda] = useState(0);
  const [sinopse, setSinopse] = useState('');
  const [conservacao, setConservacao] = useState(0);
  const [livroOferecido, setLivroOferecido] = useState({});

  useEffect(() => {
    if (id_livro_oferecido) {
      const fetchLivroOferecido = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://book-connect-backend.vercel.app/api/livros/${id_livro_oferecido}`);
          const body = await response.json();
          setLivroOferecido(body);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching livro oferecido:', error);
          setLoading(false);
        }
      };

      fetchLivroOferecido();
    }
  }, [id_livro_oferecido]);

  const onChange = (imageList) => {
    console.log(imageList);
    setImages(imageList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('data', new Date().toISOString().split('T')[0]);
    formData.append('livro_oferecido_id', id_livro_oferecido);
    formData.append('contato_id', null); // Substitua pelo ID correto do contato

    formData.append('novo_livro[titulo]', titulo);
    formData.append('novo_livro[autor]', autor);
    formData.append('novo_livro[preco_compra]', parseCurrencyValue(precoCompra));
    formData.append('novo_livro[preco_estimado]', parseCurrencyValue(precoVenda));
    formData.append('novo_livro[sinopse]', sinopse);
    formData.append('novo_livro[conservacao]', conservacao);
    formData.append('novo_livro[data_cadastro]', new Date().toISOString().split('T')[0]);
    formData.append('novo_livro[nome_vendedor]', 'Vendedor Desconhecido'); // Ajuste conforme necessário
    formData.append('novo_livro[data]', new Date().toISOString().split('T')[0]);

    if (images.length > 0) {
      formData.append('imagem', images[0].file);
    }

    try {
      const response = await fetch('https://book-connect-backend.vercel.app/api/trocas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(await response.json())
        throw new Error('Erro ao registrar a troca');
      }

      const result = await response.json();
      console.log('Troca registrada com sucesso:', result);
      router.push('/home'); // Redirecionar para a página inicial após a troca ser registrada
    } catch (error) {
      console.error('Erro ao registrar a troca:', error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className='d-flex justify-content-center mt-5'>
      <ReactLoading type={"spin"} color={"black"} height={168} width={75} />
    </div>
  ) : (
    <div className='container border p-3 mt-3 w-md-50 w-100'>
      <h2 className='mb-3 mt-2'>Troca de Livro</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="bookForm.livroTroca">
          <Form.Label>Livro Troca</Form.Label>
          <Form.Control
            type="text"
            placeholder="Livro Troca"
            value={livroOferecido.titulo || ''}
            disabled
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bookForm.title">
          <Form.Label>Título do Novo Livro</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o título do livro"
            value={titulo}
            required
            onChange={(e) => setTitulo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bookForm.author">
          <Form.Label>Autor do Novo Livro</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />
        </Form.Group>

        <div className='row'>
          <Form.Group className="mb-3 col-md-6" controlId="bookForm.buyPrice">
            <Form.Label>Valor Compra</Form.Label>
            <NumericFormat
              prefix={"R$ "}
              decimalScale={2}
              placeholder="Valor pago pelo livro"
              className='form-control'
              decimalSeparator=','
              required
              value={precoCompra}
              onValueChange={(values) => setPrecoCompra(values.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 col-md-6" controlId="bookForm.sellPrice">
            <Form.Label>Valor Venda</Form.Label>
            <NumericFormat
              prefix={"R$ "}
              decimalScale={2}
              placeholder="Valor estimado de venda"
              className='form-control'
              decimalSeparator=','
              value={precoVenda}
              required
              onValueChange={(values) => setPrecoVenda(values.value)}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3" controlId="bookForm.synopsis">
          <Form.Label>Sinopse do Novo Livro</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite a sinopse do livro"
            as="textarea"
            rows={3}
            value={sinopse}
            onChange={(e) => setSinopse(e.target.value)}
          />
        </Form.Group>
        <ImageUploading
          value={images}
          onChange={onChange}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <Form.Group className="mb-3" controlId="bookForm.image">
              <Form.Label>Imagem do Novo Livro</Form.Label>
              <div>
                {imageList.map((image, index) => (
                  <div key={index} className='position-relative'>
                    <Button variant="danger" style={{ position: 'absolute', top: 12, left: -10, textAlign: 'center', borderRadius: 50, fontSize: '12px' }} onClick={() => onImageRemove(index)}>X</Button>
                    <br></br>
                    <Image className='border' src={image['data_url']} height={150} />
                    <br></br>
                  </div>
                ))}
                {imageList.length === 0 && (
                  <Button variant="primary mt-2"
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Clique ou arraste uma imagem
                  </Button>)}
              </div>
            </Form.Group>
          )}
        </ImageUploading>
        <div key={`conservation-radio`} className="mb-3">
          <Form.Label>Estado do Novo Livro</Form.Label>
          <div className='d-flex flex-row'>
            <Form.Check
              id={0}
              name={'conservation'}
              type={'radio'}
              label={`Novo`}
              className='m-2'
              checked={conservacao === 0}
              onChange={() => setConservacao(0)}
            />
            <Form.Check
              id={1}
              name={'conservation'}
              type={'radio'}
              label={`Semi-novo`}
              className='m-2'
              checked={conservacao === 1}
              onChange={() => setConservacao(1)}
            />
            <Form.Check
              id={2}
              name={'conservation'}
              type={'radio'}
              label={`Com marcas de uso`}
              className='m-2'
              checked={conservacao === 2}
              onChange={() => setConservacao(2)}
            />
            <Form.Check
              id={3}
              name={'conservation'}
              type={'radio'}
              label={`Desgastado`}
              className='m-2'
              checked={conservacao === 3}
              onChange={() => setConservacao(3)}
            />
          </div>
        </div>
        <Button variant="primary" type="submit" className='col-12'>Registrar Troca</Button>
      </Form>
    </div>
  );
}
