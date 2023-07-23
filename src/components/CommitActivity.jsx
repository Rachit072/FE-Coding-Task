import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

export default function CommitActivity({owner,repo}) {
    const [selectedOption, setSelectedOption] = useState('changes');
    const [contributorsData, setContributorsData] = useState([]);
    const [codeFrequencyData, setCodeFrequencyData] = useState([]);
    const [commitData, setCommitData] = useState([]);

    useEffect(() => {
      fetchCommitActivity();
      fetchCodeFrequency();
      fetchContributors();
    });
  
    const fetchCommitActivity = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`);
        setCommitData(response.data);
      } catch (error) {
        console.error('Error fetching commit activity:', error);
      }
    };
  
    const fetchCodeFrequency = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`);
        setCodeFrequencyData(response.data);
      } catch (error) {
        console.error('Error fetching code frequency:', error);
      }
    };
  
    const fetchContributors = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`);
        setContributorsData(response.data);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    };
  
    const getOptions = () => {
      const commitActivityData = commitData.map((weekData) => {
        const date = new Date(weekData.week * 1000);
        return {
          x: date.getTime(),
          y: selectedOption === 'changes' ? weekData.total : weekData[selectedOption],
        };
      });
      const contributorsActivityData = contributorsData.map((contributorData) => {
        const contributions = contributorData.weeks.map((weekData) => {
          const date = new Date(weekData.w * 1000);
          return {
            x: date.getTime(),
            y: selectedOption === 'changes' ? weekData.a + weekData.d : weekData[selectedOption],
          };
        });
    
        return {
          name: contributorData.author.login,
          data: contributions,
        };
      });
      const codeFrequencyProcessed = codeFrequencyData.map((weekData) => {
        const date = new Date(weekData[0] * 1000);
        return {
          x: date.getTime(),
          additions: weekData[1],
          deletions: weekData[2],
        };
      });
    
      return {
        title: {
          text: 'Commit Activity',
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            week: '%e %b %Y',
          },
        },
        yAxis: {
          title: {
            text: selectedOption === 'changes' ? 'Total Changes' : 'Additions/Deletions/Commits',
          },
        },
        tooltip: {
          formatter: function () {
            return (
              '<b>' +
              Highcharts.dateFormat('%e %b %Y', this.x) +
              '</b><br>' +
              (selectedOption === 'changes' ? 'Total Changes: ' : 'Additions/Deletions/Commits: ') +
              this.y
            );
          },
        },
        series: [
          {
            data: commitActivityData,
            name: 'Total Changes',
            type: 'line',
          },
          ...contributorsActivityData,
           {
        name: 'Additions',
        data: codeFrequencyProcessed.map((data) => [data.x, data.additions]),
        type: 'area',
      },
      {
        name: 'Deletions',
        data: codeFrequencyProcessed.map((data) => [data.x, data.deletions]),
        type: 'area',
      },
        ],
      };
    };
  return (
    <div>
        <div>
        <select onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="changes">Total Changes</option>
          <option value="additions">Additions</option>
          <option value="deletions">Deletions</option>
          <option value="commits">Commits</option>
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={getOptions()} />
    </div>
  )
}
