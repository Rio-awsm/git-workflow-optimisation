import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import RepoList from '../components/RepoList'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const SelectRepo = () => {
    const [user, setUser] = useState(null);
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
    
        return () => unsubscribe();
      }, []);
  return (
    <section>
      <NavBar />
      <RepoList user={user}/>
    </section>
  )
}

export default SelectRepo
