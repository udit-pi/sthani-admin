import { useEffect, useState } from 'react'
import DataTable from "react-data-table-component"
import Layout from '../components/layouts/Layout'
import axiosInstance from '../utils/axiosInstance'

const Users = () => {

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])



    const fetchUsers = async () => {

        const request = await axiosInstance.get(`/users`);
        const response = await request.data;

        console.log(response.results)
        setUsers(response.results)
        setFilteredUsers(response.results)
    }


    useEffect(() => {

        fetchUsers()

    }, [])

    useEffect(() => {
        const result = users.filter(user => {
            return user.name.toLowerCase().match(search.toLowerCase());
        })
        setFilteredUsers(result);
    }, [search])

    const capitalizeString = (str) => {
        console.log(str);
        return str.toUpperCase();
    }
    users.forEach((user, index) => { user.serial = index + 1; });

    const columns = [
        {
            name: 'Id',
            selector: row => row.serial,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Verified',
            selector: row => row.isEmailVerified ? 'Yes' : 'No',
            sortable: true,
        },
        {
            name: 'Registered At',
            selector: row => row.createdAt,
            sortable: true,
        }
    ];



    return (
        <Layout>

            <div className="col-12 stretch-card container-fluid">
                <div className="card">
                    <div className="card-body">
                        <div className='table-responsive'>
                            <DataTable
                                title="Users"
                                columns={columns}
                                data={filteredUsers}
                                fixedHeader
                                pagination
                                highlightOnHover
                                subHeader
                                subHeaderComponent={
                                    <input type="text" className="w-25 form-control" placeholder="Search User" value={search}
                                        onChange={(e) => setSearch(e.target.value)} />
                                }

                            />
                        </div>

                    </div>
                </div>
            </div>
        </Layout>

    )

}

export default Users