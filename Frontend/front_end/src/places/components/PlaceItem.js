import React,{useState,useContext} from "react";
import { useHistory } from "react-router-dom";


import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import Map from "../../shared/components/UIElements/Map";
import './PlaceItem.css'
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PlaceItem = props => {
    const {isLoading,error,sendRequest,clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap,setShowMap] = useState(false);
    const [showDeletePop,setShowDeletePop] =useState(false);

    const showMapHandler = () =>{
        return setShowMap(true);
    }

    const closeMapHandler = () => {
        return setShowMap(false);
    }

    const openDeleteHandler= () =>{
        return setShowDeletePop(true);
    }

    const closeDeleteHandler = () => {
        return setShowDeletePop(false);
    }

    const deletePlaceHandler = async () => {
        // console.log("DELETED.....");
        setShowDeletePop(false);
        try{
            const responseData = await sendRequest(
                `http://localhost:5000/api/places/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization : 'Bearer '+ auth.token
                }
                );


            props.onDelete(props.id);

        }catch(err){}
    }

    return (
        <React.Fragment>
            <ErrorModal  error={error} onClear={clearError}/>
            <Modal 
                show={showMap}
                onCancel={closeMapHandler}
                header = {props.address}
                contentClass ="place-item__modal-content"
                footerClass = "place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}

            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showDeletePop}
                onCancel={closeDeleteHandler}
                header="Delete Place"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeDeleteHandler}> CANCEL </Button>
                        <Button danger onClick={deletePlaceHandler}> DELETE </Button>
                    </React.Fragment>
                }
            >
                <p> 
                    This the final confirmation popup menut to ask whether to DELETE the
                    place or not!!!.
                </p>
            </Modal>
            
           
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={showMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.userId === props.creatorId && <Button danger onClick={openDeleteHandler} >DELETE</Button>}
                    </div>
                </Card>
            </li>
            
        </React.Fragment>
    );
}

export default PlaceItem;