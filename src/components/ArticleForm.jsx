import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import ArticleList from './ArticleList';
import axios from 'axios';

const defaultArticleData = {
    title: '',
    image: '',
    content: '',
    categoryId: '',
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

            console.log('Dati inviati:', {
                ...dataWithoutCategory,
                categoryId,
            });

            const response = await axios.post('http://localhost:3000/api/posts', {
                ...dataWithoutCategory,
                categoryId,
            });
            
            setArticles([...articles, response.data]);
            setArticleData(defaultArticleData);
            setFileInput('');
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
            // Converti categoryId da stringa a numero
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
