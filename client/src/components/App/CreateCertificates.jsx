import { Input, Text } from "@nextui-org/react";
import Form from "../common/Form";
import Hero from "./shared/Hero";
import PropTypes from "prop-types";
import { useEth } from "../contexts/EthContext";
import { toast } from "react-hot-toast";
import bikesMotif from "../../assets/images/Monkey.png";

function CreateCertificates({ setLoading }) {
  const {
    state: { getCollection, account },
  } = useEth();

  ////////////////////////////////////////////////////////////////
  // Event Handlers
  ////////////////////////////////////////////////////////////////

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const collection = await getCollection();

      await collection.methods
        .batchMint(
          event.target.amount.value,
          event.target.brand.value,
          event.target.model.value,
          event.target.typeOf.value,
          event.target.color.value,
          event.target.description.value,
          event.target.image.value,
          event.target.buildYear.value
        )
        .send({ from: account });

      toast.success("Certificats créés avec succès");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error("Impossible de créer les certificats");
    }

    setLoading(false);
  }

  ////////////////////////////////////////////////////////////////
  // JSX
  ////////////////////////////////////////////////////////////////

  return (
    <>
      <div
        style={{
          background: `url(${bikesMotif})`,
          height: "100%",
          backgroundSize: "cover",
        }}
      >
        <Hero>
          <Text h2 css={{ color: "White", m: 0 }}>
            Créez vos certificats NFT
          </Text>
        </Hero>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            maxWidth: "170px",
            minWidth: "150px",
            backgroundColor: "transparent",
            borderRadius: "10px",
          }}
        >
          <Form onSubmit={handleSubmit} submitLabel="Créer">
            <Input
              css={{ background: "white", p: "1px" }}
              name="amount"
              clearable
              bordered
              placeholder="Nombre"
              type="number"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="brand"
              clearable
              bordered
              placeholder="Marque"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="model"
              clearable
              bordered
              placeholder="Modèle"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="typeOf"
              clearable
              bordered
              placeholder="Type"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="color"
              clearable
              bordered
              placeholder="Couleur"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="description"
              clearable
              bordered
              placeholder="Description"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="image"
              clearable
              bordered
              placeholder="Image"
              required
            />
            <Input
              css={{ background: "white", p: "1px" }}
              name="buildYear"
              clearable
              bordered
              placeholder="Année de fabrication"
              type="number"
              required
            />
          </Form>
        </div>
      </div>
    </>
  );
}

CreateCertificates.propTypes = {
  setLoading: PropTypes.func.isRequired,
};

export default CreateCertificates;
