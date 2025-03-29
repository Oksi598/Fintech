import { ethers } from "ethers";
import { NOTES_ABI, NOTES_ADDRESS } from "../contractsConfig/config";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../providers//AccountProvider";
import { Typography, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateNotePage = () => {
    const [content, setContent] = useState("");
    const [contract, setContract] = useState(null);
    const { account, setAccount, getAccount } = useContext(AccountContext);
    const navigate = useNavigate();

    const checkAccount = () => {
        if (!account) {
            getAccount().catch(error => console.error(error));
        }
    };

    useEffect(() => {
        checkAccount();

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
                } catch (error) {
                    toast.error("Помилка при отриманні контракту");
                    localStorage.removeItem("token");
                    setAccount(null);
                    navigate("/");
                }
            }
        };

        initContract();
    }, [account, setAccount, navigate]);

    const createNote = async () => {
        if (!contract) return;

        try {
            const tx = await contract.createNote(content);
            await tx.wait();
            toast.success("Нотатку створено успішно!");
            setContent(""); 
        } catch (error) {
            console.error("Помилка при створенні нотатки", error);
            toast.error("Не вдалося створити нотатку");
        }
    };

    return (
        <Box>
            <Typography sx={{ my: 3 }} variant="h1" textAlign="center">
                📝 Створити нотатку
            </Typography>
            <Box sx={{ my: 3 }} textAlign="center">
                <TextField
                    label="Введіть текст нотатки"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ my: 3 }} textAlign="center">
                <Button
                    onClick={createNote}
                    variant="contained"
                    color="primary"
                    disabled={!content}
                >
                    Створити нотатку
                </Button>
            </Box>
        </Box>
    );
};

export default CreateNotePage;
