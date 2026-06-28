import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { safeArray } from '../../utils/book';

const BookCard = dynamic(() => import('../../components/BookCard'), { ssr: false });

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [router.query.text]); // Re-fetch books when the text query changes

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const text = router.query.text || '';
      const response = await fetch(`https://book-connect-backend.vercel.app/api/livros?text=${encodeURIComponent(text)}`);
      const data = await response.json();
      console.log(data)

      const booksWithImages = await Promise.all(safeArray(data).map(async (book) => {
        const imageResponse = await fetch(`https://book-connect-backend.vercel.app/api/livros/image/${book.id}`);
        console.log(imageResponse)
        const blob = await imageResponse.blob();
        book.imageUrl = URL.createObjectURL(blob);
        return book;
      }));

      setBooks(booksWithImages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    router.push('/livros/detalhes');
  };

  const handleEditClick = (book) => {
    router.push(`/livros/cadastro?id=${book.id}`);
  };

  const handleSellClick = (book) => {
    router.push(`/livros/vendas/cadastro?id_book=${book.id}`);
  };

  const handleExchangeClick = (book) => {
    router.push(`/livros/trocas/cadastro?id_livro_oferecido=${book.id}`);
  };

  const handleRemoveClick = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    try {
      console.log('Deleting book:', bookToDelete.id)
      const response = await fetch(`https://book-connect-backend.vercel.app/api/livros/${bookToDelete.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setShowModal(false);
        setBooks(books.filter(book => book.id !== bookToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return loading ?
    <div className='d-flex justify-content-center mt-5'>
      <ReactLoading type={"spin"} color={"black"} height={168} width={75} />
    </div> :
    (
      <div className='container'>
        <div className='row'>
          {books.map(livro => (
            <BookCard
              key={livro.id}
              livro={livro}
              handleCardClick={handleCardClick}
              handleEditClick={() => handleEditClick(livro)}
              handleRemoveClick={() => handleRemoveClick(livro)}
              handleSellClick={() => handleSellClick(livro)}
              handleExchangeClick={() => handleExchangeClick(livro)}
            />
          ))}
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Deleção</Modal.Title>
          </Modal.Header>
          <Modal.Body>Você tem certeza que deseja deletar o livro?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Deletar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}
