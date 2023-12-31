import React, { useState } from 'react';
import CommitActivity from './CommitActivity';

function RepoCard  ({ repo }) {
  const [dropdown, setDropdown] = useState(false);

  const handleDropdown = () => {
    setDropdown((prevState) => !prevState);
  };

  return (
    <div>
      <li key={repo.id}>
      <div className='f-row'>
        <div className='avator-container'>
          <img className='avator-border' src={repo.owner.avatar_url} alt={repo.owner.login} width='110' height='115' />
        </div>
        <div className='f-col'>
          <div>{repo.name}</div>
          <div>{repo.description}</div>
          <div className='f-row'>
            <div className='box'>{repo.stargazers_count}</div>
            <div className='box'>{repo.open_issues}</div>
            <div style={{fontSize:"12px",paddingTop:"3px"}}>Last pushed {repo.pushed_at} by {repo.owner.login}</div>
          </div>
        </div>
        <div style={{flex:"1"}}></div>
        <div className='dropdown' onClick={handleDropdown}>
          {!dropdown ? (
            <img
              src='https://www.transparentpng.com/download/arrow/right-grey-arrow-icon-png-20.png'
              alt='>'
              style={{ height: '30px', width: '30px' }}
            />
          ) : (
            <img src='https://www.shareicon.net/data/128x128/2015/08/19/87500_down_512x512.png' alt='' style={{ height: '30x', width: '30px' }} />
          )}
        </div>
      </div>
      { dropdown && <CommitActivity repo={repo.name} owner={repo.owner.login}/>}
    </li>
    </div>
  );
};

export default RepoCard;
