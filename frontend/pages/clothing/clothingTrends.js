import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ClothingTrends() {
	const [trends, setTrends] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const fetchVogueTrends = async () => {
			try{
				const responses = await fetch('http://localhost:8080/api/vogueTrending');
				if(!response.ok) {
					throw new Error('HTTP error! status: ${response.status}');
				}
				const data = await response.json();
				setTrends(data);
			}catch(error) {
				console.error("Error fetching vogue trends:", error);
				setError("Error fetching vogue trends:");
			}
			setLoading(false);;
		};
		
		fetchVogueTrends();
	}, []);