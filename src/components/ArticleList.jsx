import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

function ArticleList({ articles, removeArticle }) {
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

    useEffect(() => {
        if (confirmDeleteIndex !== null) {
            const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo articolo?');
            if (confirmDelete) {
                removeArticle(confirmDeleteIndex);
            }
            setConfirmDeleteIndex(null);
        }
    }, [confirmDeleteIndex, removeArticle]);

    const handleConfirmDelete = (index) => {
        setConfirmDeleteIndex(index);
    };

    return (
        <div className='py-4'>
            {articles.map((article, index) => (
                <Card key={`article-${index}`} className="mb-3 col-6">
                    <CardBody>
                        <CardTitle tag="h5">{article.title}</CardTitle>

                        {article.image && <img src={article.image} alt="article" className='img-fluid mb-3' />}
                        
                        <CardText>
                            <strong>Contenuto:</strong> {article.content}<br />
                            <strong>Categoria:</strong> {article.category}<br />
                            <strong>Tag:</strong> {Object.keys(article.tags).filter(tag => article.tags[tag]).join(', ')}<br />
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
