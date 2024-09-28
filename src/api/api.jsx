//will need to update the endpoints
import react, { useState } from "react";
function FetchApi(){
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [loggedIn, setLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
    if (loggedIn && userId) {
        FetchData();
    }}, [loggedIn, userId]);

    const FetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/data/${userId}`);
            const jsonData = await response.json();
            if (response.ok) {
                setData(jsonData);
            } else {
                console.error(jsonData.error);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const postData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood: "Your mood here", writing: newItem })
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
            const response = await fetch('http://localhost:5000/api/login', {
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
                setUserId(data.user_id);
              } else {
                console.error(data.message);
              }
            }

        catch (error){
            console.log("error logging in:", error)
    }

    };
    return (
        console.log("you've logged in..")
    );
}

export default FetchApi;