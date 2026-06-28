import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { NumericFormat } from 'react-number-format';
import React, { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import ReactLoading from 'react-loading';
import { parseCurrencyValue } from '../../../utils/currency';

export default function Cadastro() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const [images, setImages] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [precoCompra, setPrecoCompra] = useState(0);
  const [precoVenda, setPrecoVenda] = useState(0);
  const [sinopse, setSinopse] = useState('');
  const [conservacao, setConservacao] = useState(0);

  useEffect(() => {
    if (id) {
      // Fetch existing book details if id is present
      const fetchBook = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://book-connect-backend.vercel.app/api/livros/${id}`);
          const body = await response.json();
          await fetch(`https://book-connect-backend.vercel.app/api/livros/image/${id}`).then(response => {
            if (!response.ok) {
              console.log(response)
              throw new Error('Network response was not ok');
            }
            return response.blob();
          })
            .then(blob => {
              return blobToBase64(blob).then(base64 => {
                const file = new File([blob], 'image.jpg', { type: blob.type });
                setImages([{ data_url: base64, file: file }]);
              });
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });;
          setBook(body);
          setTitulo(body.titulo);
          setAutor(body.autor);
          setPrecoCompra(body.preco_compra.toString());
          setPrecoVenda(body.preco_estimado.toString());
          setSinopse(body.sinopse);
          setConservacao(body.conservacao);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching book:', error);
        }
      };

      fetchBook();
    }
  }, [id]);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const onChange = (imageList) => {
    console.log(imageList)
    setImages(imageList);
  };

  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imagem_base64 = images[0]?.data_url || '';
    const imagemBlob = imagem_base64 ? base64ToBlob(imagem_base64, 'image/jpeg') : null;

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('autor', autor);
    formData.append('preco_compra', parseCurrencyValue(precoCompra));
    formData.append('preco_estimado', parseCurrencyValue(precoVenda));
    formData.append('sinopse', sinopse);
    formData.append('conservacao', conservacao);
    formData.append('data_cadastro', new Date().toISOString().split('T')[0]);
    formData.append('nome_vendedor', 'Some Seller');
    formData.append('data', new Date().toISOString().split('T')[0]);
    if (imagemBlob) {
      formData.append('imagem', imagemBlob);
    }

    if (id) {
      formData.append('compra_id', book.compra_id)
    }

    console.log([...formData.entries()]);

    try {
      const response = await fetch(`https://book-connect-backend.vercel.app/api/livros${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: formData
      });

      const result = await response.json();
      console.log(result);
      // Handle successful response
      router.push('/home');
    } catch (error) {
      console.error('Error:', error);
      // Handle error response
    }
  };

  return loading ?
    <div className='d-flex justify-content-center mt-5'>
      <ReactLoading type={"spin"} color={"black"} height={168} width={75} />
    </div>
    : (
      <div className='container border p-3 mt-3 w-md-50 w-100'>
        <h2 className='mb-3 mt-2'>{id ? 'Editar' : 'Adicione um'} Livro</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="bookForm.title">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o título do livro"
              value={titulo}
              required
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookForm.author">
            <Form.Label>Autor</Form.Label>
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
            <Form.Label>Sinopse</Form.Label>
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
                <Form.Label>Imagem do Livro</Form.Label>
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
            <Form.Label>Estado do livro</Form.Label>
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
          <Button variant="primary" type="submit" className='col-12'>{id ? 'Salvar Alterações' : 'Adicionar Livro'}</Button>
        </Form>
      </div>
    );
}
