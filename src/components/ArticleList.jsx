import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import axios from 'axios';

function ArticleList() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts');
                setArticles(response.data.data); // Assuming your API returns an object with a 'data' array
            } catch (error) {
                console.error('Errore durante il recupero dei post:', error);
            }
        };

        fetchArticles();
    }, []);

    const handleConfirmDelete = (indexToDelete) => {
        // Implement your delete logic here
        console.log(`Deleting article at index ${indexToDelete}`);
    };

    return (
        <div className='py-4'>
            {articles.map((article, index) => (
                <Card key={`article-${index}`} className="mb-3 col-6">
                    <CardBody>
                        <CardTitle tag="h5">{article.title}</CardTitle>
                        <div className='ratio ratio-16x9 mb-3'>
                            <img src={article.image} alt="article" className='object-fit-cover' />
                        </div>

                        <CardText>
                            <strong>Contenuto:</strong> {article.content}<br />
                            <strong>Categoria:</strong> {article.category.name}<br />
                            <strong>Tag:</strong> {article.tags.map(tag => tag.name).join(', ')}<br />
                            <strong>Pubblicato:</strong> {article.published ? 'Sì' : 'No'}
                        </CardText>

                        <Button color="danger" onClick={() => handleConfirmDelete(index)}>Rimuovi</Button>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default ArticleList;
