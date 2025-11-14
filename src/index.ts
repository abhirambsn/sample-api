import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

app.get("/", async (req, res) => {
    res.json({ message: "Hello from Typescript + Express + Jenkins + ArgoCD" });
});

app.get("/todos", async (req, res) => {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post("/todos", async (req, res) => {
    const { title, is_complete } = req.body;
    const { data, error } = await supabase.from('todos').insert([{ title, is_complete }]);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { title, is_complete } = req.body;
    const { data, error } = await supabase.from('todos').update({ title, is_complete }).eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});