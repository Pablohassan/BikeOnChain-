import { Input, Text } from "@nextui-org/react";
import useEth from "../contexts/EthContext/useEth";
import bikesMotif from "../../assets/images/robot.png";
import Hero from "./shared/Hero";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import Form from "../common/Form";

function CreateManufacturer({ setLoading }) {
  const {
    state: { contract, account , web3},
  } = useEth();

  ////////////////////////////////////////////////////////////////
  // Event Handlers
  ////////////////////////////////////////////////////////////////
  
  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    try {
      if (!web3.utils.isAddress(event.target.address.value)) {
        alert("invalid address");
      }
      await contract.methods
        .createCollection(
          event.target.name.value,
          event.target.symbol.value,
          event.target.address.value
        )
        .send({ from: account });

      toast.success("Fabricant ajouté avec succès");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error("Impossible d'ajouter le fabricant");
    }

    setLoading(false);
  }

  ////////////////////////////////////////////////////////////////
  // JSX
  ////////////////////////////////////////////////////////////////

  return (
    <>
    <div style={{

background: `url(${bikesMotif})`,height:"100%", width:"100%", backgroundSize:'cover'


    }}>
      <Hero>
        <Text h2 css={{color:'White', m: 0 }}>
          Ajouter un fabricant
        </Text>
      </Hero>
      <div style={{ display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin:"auto",
        backgroundColor:"transparent",borderRadius: "10px", maxWidth:"170px", minWidth:'150px'}} >
      <Form  onSubmit={handleSubmit} submitLabel="Créer">
        <Input css={{background:"white",p:"1px"}} name="name" placeholder="Nom du fabriquant"  aria-label="name of entreprise" clearable bordered  required />
        <Input css={{background:"white",p:"1px"}}
          name="symbol"
          clearable
          bordered
          placeholder="Symbol exemple: BTC"
          aria-label="Symbole of entreprise"
          required
        />
        <Input css={{background:"white",p:"1px"}}
          name="address"
          clearable
          bordered
          placeholder="Adresse du fabriquant"
          aria-label="Eth Adress of entreprise"
          required
        />
      </Form>
      </div>
      </div>
    </>

  );
}

CreateManufacturer.propTypes = {
  setLoading: PropTypes.func.isRequired,
};

export default CreateManufacturer;
