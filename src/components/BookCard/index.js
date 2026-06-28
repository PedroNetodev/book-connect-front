import React from 'react';
import { Card, Button, Badge, Image } from 'react-bootstrap';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConservacaoLabel } from '../../utils/book';

const BookCard = ({ livro, handleCardClick, handleRemoveClick, handleEditClick, handleSellClick, handleExchangeClick }) => {
  return (
    <div className='col-lg-4 col-md-5 col-sm-6 mt-5'>
      <div className='border p-2 m-1 d-flex flex-row'>
        <FontAwesomeIcon icon={faEdit} color='blue' style={{ cursor: "pointer" }} onClick={handleEditClick} />
        <div className='row mt-4'>
          <Image className='img-fluid col-md-5 mb-2' src={`${livro.imageUrl}`} style={{ "maxHeight": 250, "minHeight": 250 }} alt="Book Icon" />
          <div className='col-md-7' onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <Card.Title className='mt-2'>
              <strong>Titulo: </strong>
              <br />
              {livro.titulo}
            </Card.Title>
            <Card.Text className='mt-2'>
              <div>
                <strong>Estado do livro: </strong>
                <br />
                <Badge bg="secondary">{getConservacaoLabel(livro.conservacao)}</Badge>
              </div>
            </Card.Text>
            <Card.Text className='mt-2'>
              <div>
                <strong>Sinopse:</strong>
                <br />
                <p>{livro.sinopse}</p>
              </div>
            </Card.Text>
          </div>
          <Button className="col-5 m-2 btn-default" variant="outline-primary" onClick={handleExchangeClick}>Trocar</Button>
          <div className="col-1"></div>
          <Button className="col-5 m-2" variant="outline-success" onClick={handleSellClick}>Vender</Button>
        </div>
        <FontAwesomeIcon icon={faRemove} color='red' style={{ cursor: "pointer" }} onClick={handleRemoveClick} />
      </div>
    </div>
  );
};

export default BookCard;
