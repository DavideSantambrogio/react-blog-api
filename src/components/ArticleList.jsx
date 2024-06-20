import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

function ArticleList() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/posts')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setArticles(data.data);
            })
            .catch(error => {
                console.error('Errore durante il recupero dei post:', error);

            });
    }, []);


    return (
        <div className='py-4'>
            {articles.map((article, index) => (
                <Card key={`article-${index}`} className="mb-3 col-6">
                    <CardBody>
                        <CardTitle tag="h5">{article.title}</CardTitle>

                        {article.image && <img src={article.image} alt="article" className='img-fluid mb-3' />}
                        
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
