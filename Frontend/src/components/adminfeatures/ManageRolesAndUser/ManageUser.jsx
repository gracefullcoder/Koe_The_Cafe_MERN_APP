import React, { useEffect, useState } from 'react';
import { getSectionData } from '../CustomizationAssets/CustomizationFunction';
import { PrimaryButton, SecondaryButton } from '../../reuseable/Button';
import { toastMessage } from '../../../helperfunction';

function ManageUser() {

  const [users, setUsers] = useState({
    adminUsers: [],
    normalUsers: []
  });

  const [user, setUser] = useState({ id: "", fullname: "", DOB: "", gender: "" });

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getUserData = () => getSectionData("admin/users", setUsers);
    getUserData();
    console.log(users);
  }, [edit])


  const handleDeleteUser = async (userId, userType) => {
    console.log(userId, userType);
    try {
      let url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/users/${userId}`;
      const fetchUrl = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });


      console.log(fetchUrl);
      const responseData = await fetchUrl.json();

      if (fetchUrl.ok) {
        toastMessage(responseData);
        setUsers((prevUsers) => {
          return (userType === "admin"
            ? {
              normalUsers: prevUsers.normalUsers,
              adminUsers: prevUsers.adminUsers.filter((user) => (user._id != userId))
            }
            : {
              normalUsers: prevUsers.normalUsers.filter((user) => user._id != userId),
              adminUsers: prevUsers.adminUsers
            }
          )
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateRole = async (userId, role) => {
    const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/${role === "admin" ? "users" : "removeadmin"}/${userId}`;
    console.log(url);
    try {
      const fetchUrl = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const responseData = await fetchUrl.json();

      if (fetchUrl.ok) {
        setUsers((prevUsers) => {
          let newAdminUsers = [...prevUsers.adminUsers];
          let newNormalUsers = [...prevUsers.normalUsers];

          if (role === "admin") {
            newNormalUsers = prevUsers.normalUsers.filter((user) => {
              if (user._id === userId) {
                newAdminUsers.push(user);
                return false; // Remove user from normalUsers
              }
              return true;
            });
          } else {
            newAdminUsers = prevUsers.adminUsers.filter((user) => {
              if (user._id === userId) {
                newNormalUsers.push(user);
                return false; // Remove user from adminUsers
              }
              return true;
            });
          }

          return { adminUsers: newAdminUsers, normalUsers: newNormalUsers };
        });

      }
      toastMessage(responseData);
    } catch (error) {
      console.log(error);
    }

  }

  const handleEditUser = async (userId) => {
    setEdit(true);
    getSectionData(`admin/users/edit/${userId}`, setUser);
    console.log(user.fullname);
  }

  function handleInputChange(event, setState) {
    setUser((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleUserSubmit = async (event, userId) => {
    event.preventDefault();
    const userData = new FormData(event.target);
    const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/users/edit/${userId}`;
    const fetchUser = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      body: userData
    })

    const responseData = await fetchUser.json();

    if (fetchUser.ok) {
      setUser("");
      setEdit(false);
    }
    toastMessage(responseData);
  }

  return (
    <section className="manage-user">
      <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Manage Users And Roles</span></div>
      {edit ?
        <>
          <p className="headline-1 section-subtitle text-center">Update User</p>
          <form className="edit-form" onSubmit={(event) => { handleUserSubmit(event, user.id) }} encType="multipart/form-data">
            <p>Full Name</p>
            <input className='input-field'
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleInputChange}
            />
            <p>Gender</p>
            <select className='input-field'
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <p style={{ marginBlockStart: '1.5rem' }}>Date Of Birth</p>
            <input className='input-field'
              type="date"
              name="DOB"
              value={user.DOB.toString().slice(0, 10)}
              onChange={handleInputChange}
            />

            <div className="imageupload">
              <input className='input-field'
                type="file"
                id="myFile"
                name="myFile"
                onChange={handleInputChange}
              />
            </div>
            <PrimaryButton text1={"Upadate User!"} text2={"Do It!"} />
          </form>
        </>
        :
        <>
          <div className='table-container'>
            <p className='text-center headline-1'>Admin Users Details!</p>
            <table className="details-table">
              <thead>
                <tr>
                  <th scope="col">NAME</th>
                  <th scope="col">Email</th>
                  <th scope="col">Created By</th>
                  <th scope="col">Remove as Admin</th>
                  <th scope="col">Delete User</th>
                  <th scope="col">Edit Details</th>
                </tr>
              </thead>
              <tbody>
                {users.adminUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.username}</td>
                    <td>
                      Name: {user.role.creatorname}
                      <br />
                      Email: {user.role.creatoremail}
                    </td>
                    <td>
                      <SecondaryButton text1={"Normal User"} text2={"Create it!"} fnx={() => { updateRole(user._id, "normal") }} />
                    </td>
                    <td>
                      <SecondaryButton text1={"Delete User"} text2={"Do it!"} fnx={() => { handleDeleteUser(user._id, "admin") }} />
                    </td>
                    <td>
                      <SecondaryButton text1={"Edit User!"} text2={"Let's Do!"} fnx={() => { handleEditUser(user._id) }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='table-container'>
            <p className='text-center headline-1'>Noraml Users Details</p>
            <table className="details-table">
              <thead>
                <tr>
                  <th scope="col">NAME</th>
                  <th scope="col">Email</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Assign Admin</th>
                  <th scope="col">Remove User</th>
                  <th scope="col">Edit Details</th>
                </tr>
              </thead>
              <tbody>
                {users.normalUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.username}</td>
                    <td>{user.gender}</td>

                    <td>
                      <SecondaryButton text1={"Admin User"} text2={"Create it!"} fnx={() => { updateRole(user._id, "admin") }} />
                    </td>
                    <td>
                      <SecondaryButton text1={"Delete User"} text2={"Do it!"} fnx={() => { handleDeleteUser(user._id, "normal") }} />
                    </td>
                    <td>
                      <SecondaryButton text1={"Edit User!"} text2={"Let's Do!"} fnx={handleEditUser} />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

    </section>
  )
}

export default ManageUser