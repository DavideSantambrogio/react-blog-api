import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import ArticleList from './ArticleList';
import axios from 'axios';

const defaultArticleData = {
    title: '',
    image: '',
    content: '',
    categoryId: '',
    tags: [],
    published: false,
};

function ArticleForm() {
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState(defaultArticleData);
    const [fileInput, setFileInput] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [showAlert, setShowAlert] = useState(false); // Stato per mostrare l'alert

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/categories');
                setCategoryOptions(response.data);
            } catch (error) {
                console.error('Errore nel recupero delle categorie:', error.message);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tags');
                setTagOptions(response.data);
            } catch (error) {
                console.error('Errore nel recupero dei tags:', error.message);
            }
        };

        fetchCategories();
        fetchTags();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { category, ...dataWithoutCategory } = articleData;
            const categoryId = parseInt(category);
            const tagIds = articleData.tags.map(tag => tag.id); // Estrae gli ID dai tag selezionati

            const response = await axios.post('http://localhost:3000/api/posts', {
                ...dataWithoutCategory,
                categoryId,
                tagIds,
            });

            setArticles((prevArticles) => {
                const updatedArticles = [response.data, ...prevArticles];
                updatedArticles.sort((a, b) => b.id - a.id);
                return updatedArticles;
            });

            setArticleData(defaultArticleData);
            setFileInput('');
            setShowAlert(true); // Mostra l'alert quando il post è stato pubblicato
            setTimeout(() => setShowAlert(false), 3000); // Nasconde l'alert dopo 3 secondi

        } catch (error) {
            console.error('Errore durante l\'aggiunta dell\'articolo:', error.message);
        }
    };

    const removeArticle = (indexToDelete) => {
        setArticles((prevArticles) => prevArticles.filter((_, i) => i !== indexToDelete));
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            if (name === 'published') {
                setArticleData((prevData) => ({
                    ...prevData,
                    [name]: checked,
                }));
            } else {
                // Gestisci selezione/deselezione dei tag
                const selectedTag = tagOptions.find(tag => tag.name === name);
                if (checked) {
                    setArticleData((prevData) => ({
                        ...prevData,
                        tags: [...prevData.tags, selectedTag],
                    }));
                } else {
                    setArticleData((prevData) => ({
                        ...prevData,
                        tags: prevData.tags.filter(tag => tag.name !== name),
                    }));
                }
            }
        } else if (type === 'file') {
            const file = files[0];
            setArticleData((prevData) => ({
                ...prevData,
                [name]: URL.createObjectURL(file),
            }));
            setFileInput(file.name);
        } else {
            const numericValue = name === 'category' ? parseInt(value) : value;
            setArticleData((prevData) => ({
                ...prevData,
                [name]: numericValue,
            }));
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="title">Titolo</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Titolo"
                        type="text"
                        value={articleData.title}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="image">Immagine (URL)</Label>
                    <Input
                        id="image"
                        name="image"
                        type="text"
                        placeholder="Inserisci l'URL dell'immagine"
                        value={articleData.image}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="content">Descrizione</Label>
                    <Input
                        id="content"
                        name="content"
                        placeholder="Contenuto"
                        type="textarea"
                        value={articleData.content}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="category">Categoria</Label>
                    <Input
                        id="category"
                        name="category"
                        type="select"
                        value={articleData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleziona una categoria</option>
                        {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup tag="fieldset">
                    <legend>Tag</legend>
                    <Row>
                        {tagOptions.map((tag) => (
                            <Col key={tag.id} sm={4}>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            name={tag.name}
                                            checked={articleData.tags.some(t => t.id === tag.id)}
                                            onChange={handleChange}
                                        />
                                        {tag.name}
                                    </Label>
                                </FormGroup>
                            </Col>
                        ))}
                    </Row>
                </FormGroup>

                <FormGroup switch>
                    <Input
                        type="switch"
                        name="published"
                        checked={articleData.published}
                        onChange={handleChange}
                    />
                    <Label check>Pubblica</Label>
                </FormGroup>

                <Button type="submit" color="success">
                    Aggiungi Articolo
                </Button>
            </Form>

            {showAlert && (
                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    Post pubblicato con successo!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}></button>
                </div>
            )}

            <ArticleList articles={articles} removeArticle={removeArticle} />
        </>
    );
}

export default ArticleForm;
