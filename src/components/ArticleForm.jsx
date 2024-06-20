import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import ArticleList from './ArticleList';

const defaultArticleData = {
    title: '',
    image: '',
    content: '',
    category: '',
    tags: {},
    published: false,
};

function ArticleForm() {
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState(defaultArticleData);
    const [fileInput, setFileInput] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        // Funzione per caricare le categorie dal backend
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategoryOptions(data);
                } else {
                    console.error('Errore nel recupero delle categorie:', response.statusText);
                }
            } catch (error) {
                console.error('Errore durante la chiamata API:', error);
            }
        };

        // Funzione per caricare i tag dal backend
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tags');
                if (response.ok) {
                    const data = await response.json();
                    setTagOptions(data);
                } else {
                    console.error('Errore nel recupero dei tags:', response.statusText);
                }
            } catch (error) {
                console.error('Errore durante la chiamata API:', error);
            }
        };

        // Chiamate API per caricare categorie e tags
        fetchCategories();
        fetchTags();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const handleSubmit = (e) => {
        e.preventDefault();
        setArticles([...articles, articleData]);
        setArticleData(defaultArticleData);
        setFileInput('');
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
                setArticleData((prevData) => ({
                    ...prevData,
                    tags: {
                        ...prevData.tags,
                        [name]: checked,
                    },
                }));
            }
        } else if (type === 'file') {
            const file = files[0];
            setArticleData((prevData) => ({
                ...prevData,
                [name]: URL.createObjectURL(file),
            }));
            setFileInput(file.name);
        } else {
            setArticleData((prevData) => ({
                ...prevData,
                [name]: value,
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
                    <Label for="image">Immagine</Label>
                    <Input id="image" name="image" type="file" onChange={handleChange} />
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
                    <Label>Tag</Label>
                    <Row>
                        {tagOptions.map((tag) => (
                            <Col key={tag.id} sm={4}>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            name={tag.name}
                                            checked={articleData.tags[tag.name] || false}
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

            <ArticleList articles={articles} removeArticle={removeArticle} />
        </>
    );
}

export default ArticleForm;
