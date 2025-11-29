import React from 'react';
import { useAuth } from '../context/AuthContext';

export const SessionModal = () => {
    const { showSessionModal, continueSession, cancelSession } = useAuth();

    if (!showSessionModal) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3>Tu sesión está por expirar</h3>
                <p>¿Deseas continuar?</p>

                <div style={styles.buttons}>
                    <button onClick={continueSession} style={styles.btnYes}>
                        Continuar sesión
                    </button>

                    <button onClick={cancelSession} style={styles.btnNo}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    },
    modal: {
        background: "hsl(252.63deg 22.89% 16.27%)",
        padding: "20px",
        borderRadius: "8px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0px 3px 15px rgba(0,0,0,0.3)"
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px"
    },
    btnYes: {
        padding: "10px 20px",
        background: "#27ae60",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    },
    btnNo: {
        padding: "10px 20px",
        background: "#c0392b",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    }
};
export default SessionModal;