import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { NOTES_ABI, NOTES_ADDRESS } from "../contractsConfig/config";
import { Typography, Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { AccountContext } from "../providers/AccountProvider";

const DeleteNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [note, setNote] = useState(null);
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
                    const noteToDelete = notesData.find((note) => note.id === parseInt(id));
                    if (noteToDelete) {
                        setNote(noteToDelete);
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

    const deleteNote = async () => {
        if (!contract) return;
        try {
            const tx = await contract.deleteNote(id);
            await tx.wait();
            toast.success("Нотатку видалено успішно!");
            navigate("/");
        } catch (error) {
            console.error("Помилка при видаленні нотатки", error);
            toast.error("Не вдалося видалити нотатку");
        }
    };

    return (
        <Box>
            <Typography sx={{ my: 3 }} variant="h1" textAlign="center">
                ❌ Видалити нотатку
            </Typography>
            {note ? (
                <Box textAlign="center">
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>Контент:</strong> {note.content}
                    </Typography>
                    <Button onClick={deleteNote} variant="contained" color="error">
                        Видалити нотатку
                    </Button>
                </Box>
            ) : (
                <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
                    Нотатку не знайдено.
                </Typography>
            )}
        </Box>
    );
};

export default DeleteNotePage;