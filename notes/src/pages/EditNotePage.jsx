import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { NOTES_ABI, NOTES_ADDRESS } from "../contractsConfig/config";
import { Typography, Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { AccountContext } from "../providers/AccountProvider";

const EditNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [content, setContent] = useState("");
    const { account, setAccount, getAccount } = useContext(AccountContext);

    useEffect(() => {
        const checkAccount = async () => {
            if (!account) {
                await getAccount().catch(error => console.error(error));
            }
        };

        const initContract = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const notesContract = new ethers.Contract(
                        NOTES_ADDRESS,
                        NOTES_ABI,
                        signer
                    );
                    setContract(notesContract);

                    const notesData = await notesContract.getNotes();
                    const noteToEdit = notesData.find((note) => note.id === parseInt(id));
                    if (noteToEdit) {
                        setContent(noteToEdit.content);
                    } else {
                        toast.error("Нотатку не знайдено");
                        navigate("/");
                    }
                } catch (error) {
                    toast.error("Помилка при отриманні нотатки");
                    navigate("/");
                }
            }
        };

        checkAccount();
        initContract();
    }, [id, account, navigate, getAccount]);

    const updateNote = async () => {
        if (!contract) return;
        try {
            const tx = await contract.updateNote(id, content);
            await tx.wait();
            toast.success("Нотатку оновлено успішно!");
            navigate("/");
        } catch (error) {
            console.error("Помилка при оновленні нотатки", error);
            toast.error("Не вдалося оновити нотатку");
        }
    };

    return (
        <Box>
            <Typography sx={{ my: 3 }} variant="h1" textAlign="center">
                ✏️ Редагувати нотатку
            </Typography>
            <TextField
                label="Контент"
                variant="outlined"
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Box textAlign="center">
                <Button onClick={updateNote} variant="contained" color="primary" disabled={!content}>
                    Оновити нотатку
                </Button>
            </Box>
        </Box>
    );
};

export default EditNotePage;
