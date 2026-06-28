import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Index() {
    return (
        <div className="container m-3 p-3">
            <a href="/contatos/cadastro" className="btn btn-primary">Cadastrar</a>
            <div className="row">
                <div className="col-sm-12">
                    <table id="table-clientes" className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Email</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='pointer' style={{ cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faEdit} color='blue' className='pointer' />
                                </td>
                                <th scope="row">1</th>
                                <td>João da Silva</td>
                                <td>(11) 99999-9999</td>
                                <td style={{ cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faRemove} color='red' className='pointer' />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}
