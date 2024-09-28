
//will need to update the endpointss
import react, { useState } from "react";
function fetchapi(){
    const [data, setdata] = useState([]);
    const [newitem, setnewitem] = useState('');
    const [loggedin, setlogin] = useState(false);
    const [username, password] = useState('');

    const fetchdata = async () => {
        try {
          const response = await fetch('/api/data'); 
          const jsondata = await response.json();
          setdata(jsondata.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const postdata = async () => {
        try {
          const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: newitem })
          });
    
          if (response.ok) {
            console.log('item added');
            setnewitem('');
            fetchdata();
          } else {
            console.error('Error adding item');
          }
        } catch (error) {
          console.error('Error posting data:', error);
        }
      };

    const handlelogin = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                setlogin(true);
              } else {
                console.error(data.message);
              }
            }

        catch(error){
            console.log("error logging in:", error)
    }
    };
    return (
        console.log("you've logged in..")
        // I don't know what to return..
    );
}

export default fetchapi;