import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactLoading from 'react-loading';

export default function Trocas() {
    const [trocas, setTrocas] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    console.log(trocas)

    useEffect(() => {
        const fetchTrocas = async () => {
            try {
                const response = await fetch('https://book-connect-backend.vercel.app/api/trocas');
                const data = await response.json();
                setTrocas(data);
            } catch (error) {
                console.error('Erro ao buscar trocas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrocas();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar esta troca?')) {
            try {
                const response = await fetch(`https://book-connect-backend.vercel.app/api/trocas/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    console.log(await response.json())
                    throw new Error('Erro ao deletar troca');
                }
                setTrocas(trocas.filter((troca) => troca.id !== id));
            } catch (error) {
                console.error('Erro ao deletar troca:', error);
            }
        }
    };

    return loading ? (
        <div className='d-flex justify-content-center mt-5'>
            <ReactLoading type={"spin"} color={"black"} height={168} width={75} />
        </div>
    ) : (
        <div className="container m-3 p-3">
            <div className="row">
                <div className="col-sm-12">
                    <table id="table-trocas" className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Livro Oferecido</th>
                                <th scope="col">Livro Doado</th>
                                <th scope="col">Data</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(trocas) && trocas.map((troca) => (
                                <tr key={troca.id}>
                                    <td>{troca.livro_oferecido}</td>
                                    <td>{troca.livro_doado}</td>
                                    <td>{new Date(troca.data).toLocaleString()}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            color='red'
                                            className='pointer'
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDelete(troca.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
