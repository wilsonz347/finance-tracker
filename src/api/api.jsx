
//will need to update the endpoints
import react, { useState } from "react";
function FetchApi(){
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [loggedIn, setLogin] = useState(false);
    const [username, password] = useState('');

    useEffect(() => {
        if (loggedIn) {
            FetchData();
        }
    }, [loggedIn]);

    const FetchData = async () => {
        try {
          const response = await fetch('/api/data'); 
          const jsonData = await response.json();
          setData(jsonData.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const postData = async () => {
        try {
          const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: newItem })
          });
    
          if (response.ok) {
            console.log('item added');
            setNewItem('');
            FetchData();
          } else {
            console.error('Error adding item');
          }
        } catch (error) {
          console.error('Error posting data:', error);
        }
      };

    const handleLogin = async () => {
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
                setLogin(true);
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

export default FetchApi;