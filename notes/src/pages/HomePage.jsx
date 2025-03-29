import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { NOTES_ABI, NOTES_ADDRESS } from "../contractsConfig/config";
import { Typography, Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { AccountContext } from "../providers/AccountProvider";

const HomePage = () => {
    const [notes, setNotes] = useState([]);
    const [contract, setContract] = useState(null);
    const { account, getAccount } = useContext(AccountContext);

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
                    setNotes(notesData);
                } catch (error) {
                    toast.error("Помилка при завантаженні нотаток");
                }
            }
        };

        checkAccount();
        initContract();
    }, [account, getAccount]);

    return (
        <Box>
            <Typography variant="h1" textAlign="center" sx={{ my: 3 }}>
                📝 Усі нотатки
            </Typography>
            {notes.length === 0 ? (
                <Typography variant="body1" textAlign="center" sx={{ my: 3 }}>
                    Немає нотаток.
                </Typography>
            ) : (
                <Box>
                    {notes.map((note, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                            <Typography variant="body1">
                                <strong>Контент:</strong> {note.content}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Автор: {note.author}
                            </Typography>
                            <Button variant="contained" color="error" sx={{ mt: 1 }}>
                                Видалити
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default HomePage;
