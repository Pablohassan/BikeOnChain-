import {
  Button,
  Input,
  Link,
  Modal,
  Text,
  Card,
  Col,
  Row,
  Grid,
  Badge,
  Table,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useEth } from "../contexts/EthContext";

import PropTypes from "prop-types";
import { statusToColor, statusToString } from "../../utils/bike";
import { toast } from "react-hot-toast";

function Nft({ setLoading }) {
  const { collectionAddr, tokenId } = useParams();
  const [bike, setBike] = useState(null);
  const {
    state: { getCollection, account, web3 },
  } = useEth();

  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMainteurModal, setShowAddMainteurModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    async function fetchMaint() {
      const collection = await getCollection(collectionAddr);
      setMaintenance(
        await collection.methods
          .getRealisedMaintenance(tokenId)
          .call({ from: account })
      );
    }

    fetchMaint();
  }, [account, collectionAddr, getCollection, tokenId]);

  useEffect(() => {
    setLoading(true);

    async function fetch() {
      const collection = await getCollection(collectionAddr);
      setBike(
        await collection.methods.getBike(tokenId).call({ from: account })
      );
    }

    fetch().finally(() => setLoading(false));
  }, [setLoading, getCollection, collectionAddr, tokenId, account]);

  ////////////////////////////////////////////////////////////////
  // Event Handlers
  ////////////////////////////////////////////////////////////////

  function handleChangeStatus(status) {
    return async () => {
      setLoading(true);
      setShowChangeStatusModal(false);
      try {
        const collection = await getCollection(collectionAddr);

        if (status === 2) {
          await collection.methods
            .setInService(tokenId)
            .send({ from: account });
        } else if (status === 3) {
          await collection.methods
            .setOnSale(tokenId, new Date().getTime())
            .send({ from: account });
        } else if (status === 4) {
          await collection.methods.setStolen(tokenId).send({ from: account });
        } else if (status === 5) {
          await collection.methods
            .setMaintenanceStatus(tokenId, AddMainteneur())
            .send({ from: account });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        toast.error("Statut inchangé");
      }

      setLoading(false);
      window.location.reload();
    };
  }

  async function handleTransfer(event) {
    if (bike.status == 4) return "You can't sell stolen bike";
    event.preventDefault();
    setShowTransferModal(false);
    setLoading(true);

    try {
      if (!web3.utils.isAddress(event.target.to.value)) {
        alert("invalid address");
      }
      const collection = await getCollection(collectionAddr);

      if (bike.status === "1") {
        await collection.methods
          .transferForService(
            account,
            event.target.to.value,
            tokenId,
            event.target.sn.value,
            new Date().getTime()
          )
          .send({ from: account });
      } else {
        await collection.methods
          .safeTransferFrom(account, event.target.to.value, tokenId)
          .send({ from: account });
      }

      toast.success("Transfert effectué");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error("Transférer échoué");
    }

    setLoading(false);
  }

  async function AddMainteneur(event) {
    event.preventDefault();
    setShowAddMainteurModal(false);
    setLoading(true);

    try {
      if (!web3.utils.isAddress(event.target.to.value)) {
        alert("invalid address");
      }
      const collection = await getCollection(collectionAddr);

      await collection.methods
        .setMaintenanceStatus(tokenId, event.target.to.value)
        .send({ from: account });
      toast.success("Mainteneur ajouté avec succès");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error("Transférer échoué");
    }

    setLoading(false);
  }

  async function SetMaintenance(event) {
    event.preventDefault();
    setShowMaintenanceModal(false);
    setLoading(true);

    try {
      const collection = await getCollection(collectionAddr);

      await collection.methods
        .setMaintenance(
          tokenId,
          event.target.es.value,
          event.target.to.value,
          new Date().getTime(),
          account
        )
        .send({ from: account });
      toast.success("Maintenance Realisé");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error("Transférer échoué");
    }

    setLoading(false);
    window.location.reload();
  }

  ////////////////////////////////////////////////////////////////
  // JSX
  ////////////////////////////////////////////////////////////////

  if (!bike) {
    return null;
  }

  const Card1 = () => (
    <Card
      isHoverable
      css={{
        display: "flex",
        mt: "20px",
        maxHeight: "550px",
        maxWidth: "500px",
        minWidth: "380px",
      }}
    >
      <Card.Header css={{ p: "15px", position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Text size={12} weight="bold" transform="uppercase" color="black">
            {bike.model}
          </Text>

          <Text h4 color="black">
            {bike.brand} #{tokenId}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ mt: "25px" }}>
        <Card.Image
          src={bike.image}
          objectFit="cover"
          width="90%"
          height="90%"
          alt="Card image background"
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col>
            <Row justify="flex-end">
              <Badge
                isSquared
                css={{ minWidth: "100px" }}
                color={statusToColor(Number(bike.status))}
              >
                <Text
                  css={{ color: "greens" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  {statusToString(Number(bike.status))}
                </Text>
              </Badge>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );

  const columns = [
    {
      key: "name",
      label: "Description",
    },
    {
      key: "role",
      label: "Cout",
    },
    {
      key: "status",
      label: "Date",
    },
  ];
  const rows = [];

  return (
    <div>
      <Grid.Container
        css={{
          maxWidth: "1000px",
          minWidth: "768px",
          display: "grid",
          gridTemplateRows: " 1fr 1fr 1fr 1fr",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gap: "10px",
          height: "100%",
        }}
      >
        <Grid
          css={{
            gridRowStart: "1",
            gridColumnStart: "1",
            gridRowEnd: "5",
            gridColumnEnd: "5",
          }}
          size={3}
        >
          <Card1 />
          <Grid
            css={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              maxWidth: "500px",
            }}
          >
            <Card
              variant="bordered"
              css={{
                display: "flex",
                m: "1px",
                maxWidth: "250px",
                minWidth: "50px",
                maxHeight: "100px",
              }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={14}>
                  Etat du vélo
                </Text>
                <Text
                  css={{ textAlign: "center", overflow: "hidden" }}
                  color={statusToColor(Number(bike.status))}
                  h3
                  weight="bold"
                  size={12}
                >
                  {statusToString(Number(bike.status))}
                </Text>
              </Card.Body>
            </Card>

            <Card
              variant="bordered"
              css={{
                m: "1px",
                maxWidth: "250px",
                minWidth: "50px",
                maxHeight: "100px",
              }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h4 weight="bold" size={13}>
                  Date de première vente
                </Text>
                <Text css={{ textAlign: "center" }} h4 weight="bold" size={12}>
                  {new Date(Number(bike.firstPurchaseDate)).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </Text>
              </Card.Body>
            </Card>
            <Card
              variant="bordered"
              css={{ m: "1px", maxWidth: "250px", minWidth: "50px" }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={13}>
                  Numéro de série
                </Text>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={13}>
                  {bike.serialNumber ? bike.serialNumber : "N/A"}
                </Text>
              </Card.Body>
            </Card>

            <Card
              variant="bordered"
              css={{ m: "1px", maxWidth: "250px", minWidth: "50px" }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={13}>
                  Année de fabrication
                </Text>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={12}>
                  {bike.buildYear}
                </Text>
              </Card.Body>
            </Card>

            <Card
              variant="bordered"
              css={{ m: "1px", maxWidth: "250px", minWidth: "50px" }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={13}>
                  Coleur
                </Text>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={12}>
                  {bike.color}
                </Text>
              </Card.Body>
            </Card>

            <Card
              variant="bordered"
              css={{ m: "1px", maxWidth: "250px", minWidth: "50px" }}
            >
              <Card.Body>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={14}>
                  Type
                </Text>
                <Text css={{ textAlign: "center" }} h3 weight="bold" size={12}>
                  {bike.typeOf}
                </Text>
              </Card.Body>
            </Card>

            {/* <Card
            variant="bordered"
            css={{ m: "1px",maxWidth:"500px",minWidth: "400px"}}
          >
            <Card.Body>
              <Text weight="bold" align="center" size={14}>
                A propos de {bike.description}
              </Text>
            </Card.Body>
          </Card> */}
          </Grid>
        </Grid>

        <Grid
          css={{
            gridRowStart: "1",
            gridColumnStart: "5",
            gridRowEnd: "5",
            gridColumnEnd: "8",
          }}
        >
          <Grid.Container css={{ display: "flex", flexFlow: "column" }}>
            <Text
              css={{ mt: "50px", mw: "250px" }}
              size={12}
              weight="bold"
              transform="uppercase"
              color="black"
            >
              {bike.description}
            </Text>

            <Text css={{ mt: "20px" }} h4>
              {" "}
              Intereagisez avec votre NFT{" "}
            </Text>

            <Grid css={{ maxWidth: "250px" }}>
              <Button
                size="lg"
                css={{ mt: "30px", minWidth: "160px" }}
                shadow
                color="gradient"
                auto
                onClick={() => setShowChangeStatusModal(true)}
              >
                <Text
                  weight="bold"
                  h3
                  size={14}
                  color="White"
                  css={{ pt: "10px" }}
                >
                  Changer Status
                </Text>
              </Button>

              <Button
                size="lg"
                css={{ mt: "10px", minWidth: "160px" }}
                shadow
                color="gradient"
                auto
                onClick={() => setShowTransferModal(true)}
              >
                <Text
                  weight="bold"
                  h3
                  size={14}
                  color="White"
                  css={{ pt: "10px" }}
                >
                  Transférer NFT
                </Text>
              </Button>
              <Button
                size="lg"
                css={{ mt: "10px", minWidth: "160px" }}
                shadow
                color="gradient"
                auto
              >
                <Link
                  href={`https://testnets.opensea.io/assets/goerli/${collectionAddr}/${tokenId}`}
                >
                  <Text
                    weight="bold"
                    h3
                    size={14}
                    color="White"
                    css={{ pt: "10px" }}
                  >
                    Look at OpenSea
                  </Text>
                </Link>
              </Button>
              <Button
                color="gradient"
                size="lg"
                css={{ mt: "10px", minWidth: "160px" }}
                shadow
                auto
              >
                <Link href={`https://goerli.etherscan.io/address/${account}`}>
                  <Text
                    weight="bold"
                    h3
                    size={14}
                    color="White"
                    css={{ pt: "10px" }}
                  >
                    Verify Contract
                  </Text>
                </Link>
              </Button>

              <Button
                size="lg"
                css={{ mt: "50px", minWidth: "160px" }}
                shadow
                color="warning"
                auto
                onClick={() => setShowAddMainteurModal(true)}
              >
                <Text
                  weight="bold"
                  h3
                  size={14}
                  color="White"
                  css={{ pt: "10px" }}
                >
                  Ajout Mainteneur
                </Text>
              </Button>
              <Button
                size="lg"
                css={{ mt: "10px", minWidth: "160px" }}
                shadow
                color="warning"
                auto
                onClick={() => setShowMaintenanceModal(true)}
              >
                <Text
                  weight="bold"
                  h3
                  size={14}
                  color="White"
                  css={{ pt: "10px" }}
                >
                  Maintenance
                </Text>
              </Button>
            </Grid>
            <Text h4 css={{ mt: "10px" }} h6>
              {" "}
              Maintenance réalisé
            </Text>

            <Card>
              <Table
                aria-label="table with dynamic content"
                css={{
                  fontSize: "14px",
                  height: "auto",
                  minWidth: "100%",
                }}
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column css={{ bg: "$green300" }} key={column.key}>
                      {column.label}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={rows}>
                  {maintenance.map((book, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{book.store}</Table.Cell>
                      <Table.Cell>{book.commentar}</Table.Cell>
                      <Table.Cell>
                        {new Date(
                          Number(book.maintenanceDate)
                        ).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>{" "}
            </Card>
          </Grid.Container>
        </Grid>
      </Grid.Container>
      {showChangeStatusModal && (
        <Modal closeButton open onClose={() => setShowChangeStatusModal(false)}>
          <Modal.Header>
            <Text>Change le status</Text>
          </Modal.Header>
          <Modal.Body>
            {[2, 3, 4, 5].map((status) => (
              <Button
                key={status}
                color={statusToColor(status)}
                onClick={handleChangeStatus(status)}
              >
                {statusToString(status)}
              </Button>
            ))}
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
      {showTransferModal && (
        <Modal closeButton open onClose={() => setShowTransferModal(false)}>
          <Modal.Header>
            <Text>Transférer</Text>
          </Modal.Header>
          <Modal.Body>
            <form
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              onSubmit={handleTransfer}
            >
              <Input
                name="to"
                clearable
                bordered
                fullWidth
                label="Adresse du receveur"
              />
              {bike.status === "1" && (
                <Input
                  name="sn"
                  clearable
                  bordered
                  fullWidth
                  label="Numéro de série"
                />
              )}
              <Button type="submit">Transférer</Button>
            </form>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}{" "}
      {showAddMainteurModal && (
        <Modal closeButton open onClose={() => setShowAddMainteurModal(false)}>
          <Modal.Header>
            <Text>Add Mainteneur address</Text>
          </Modal.Header>
          <Modal.Body>
            <form
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              onSubmit={AddMainteneur}
            >
              <Input
                name="to"
                clearable
                bordered
                fullWidth
                label="Adresse du Mainteneur"
              />

              <Button type="submit">Add Mainteneur</Button>
            </form>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
      {showMaintenanceModal && (
        <Modal closeButton open onClose={() => setShowMaintenanceModal(false)}>
          <Modal.Header>
            <Text> Maintenance</Text>
          </Modal.Header>
          <Modal.Body>
            <form
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              onSubmit={SetMaintenance}
            >
              <Input
                name="es"
                clearable
                bordered
                fullWidth
                label="Description"
              />
              <Input name="to" clearable bordered fullWidth label="Cout" />

              <Button type="submit">Valider la maintenance</Button>
            </form>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
    </div>
  );
}

Nft.propTypes = {
  setLoading: PropTypes.func.isRequired,
};

export default Nft;
