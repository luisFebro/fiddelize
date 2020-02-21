import axios from 'axios';

export default function getItem(urlOrRoute) {
    return new Promise((resolve, reject) => {
        axios
            .get(urlOrRoute)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err));
    });
}

// Alternative
//fetchUsers(data)
// const fetchUsers = async () => {
//     const response = await axios.get('api/user/list/all');
//     setData(response.data);
// };
