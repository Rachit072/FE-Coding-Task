import React,{useEffect,useState} from 'react';
import axios from 'axios';
import './App.css';
import RepoCard from './compoents/RepoCard';


function App() {
  const [repos, setRepos] = useState([]);
  const [currentpage, setCurrentpage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetchRepos(currentpage)
  },[currentpage])

  const fetchRepos = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=created:%3E2017-10-22&sort=stars&order=desc&page=${page}`
      );
      setLoading(false);

      if (page === 1) {
        setRepos(response.data.items);
      } else {
        setRepos((prevRepos) => [...prevRepos, ...response.data.items]);
      }
    } catch (error) {
      console.error('Error fetching most starred repos:', error);
      setLoading(false);
    }
    }

    const handleIntersection = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setCurrentpage((prevPage) => prevPage + 1);
      }
    };
    useEffect(() => {
      const options = {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      };
  
      const observer = new IntersectionObserver(handleIntersection, options);
      const loader = document.getElementById('loader');
  
      if (loader) {
        observer.observe(loader);
      }
  
      return () => {
        if (loader) {
          observer.unobserve(loader);
        }
      };
    }, []);
  
  return (
    <div className="App">
      <h1 className='text-3xl font-bold underline'>Most Starred Repos</h1>
      <ul className='repo-container'>
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
        ))}
      </ul>
      {loading && <div>Loading...</div>}
      <div id="loader" style={{ height: '20px' }}></div>
    </div>
  );
}

export default App;
