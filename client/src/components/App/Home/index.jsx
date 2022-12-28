import { Text } from "@nextui-org/react";
import video from "../../../assets/videos/videoplayback.mp4";
import polygonLogo from "../../../assets/images/polygon-matic-logo.png";
import bicycleBlockChainIcon from "../../../assets/images/bicycle-block-chain.png";
import certificateIcon from "../../../assets/images/NFTBoc.jpeg";
import thiefIcon from "../../../assets/images/thief.jpg";
import TextBlock from "./TextBlock";

function Home() {
  return (
    <>
      <div
        style={{
          position: "relative",
          minWidth: "360px",
          zIndex: 100,
          height: 500,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <img
          src={velo}
          width={400}
          style={{
            position: "absolute",
            top: -150,
            left: 0,
            // filter: "blur(4px)",
            width: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        /> */}
        <video
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: "-5%",
            left: "-10%",
            filter: "blur(0.5px)",
            width: "120%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Text
        shadow='0 2px 8px 2px rgb(104 112 118 / 0.09)'
          h1
          css={{
           
            fontSize:"2em",
            maxW:"80%",
          shadow:"1px 2px 1px, $gray900",
            color: "WhiteSmoke",
            borderRadius: "4px",
            // background: "white",
            padding: "10px 15px",
          }}
        >   
        Sécurisez et donnez une vie digitale à votre vélo <br />
         grace au NFT inteligent de BikeOnChain
          <img
            width={50}
            src={polygonLogo}
            style={{ verticalAlign: "text-top", marginLeft: 10 }}
            alt="Polygon"
            title="Polygon"
          />
        </Text>
      </div>
      <div
        style={{
          padding: "5% 10%",
          display: "flex",
          flexDirection: "column",
          gap: 70,
        }}
      >
        <TextBlock icon={bicycleBlockChainIcon}>
          On peut définir la blockchain comme une base de données qui contient
          l’historique de tous les échanges effectués entre ses utilisateurs
          depuis sa création. Cette base de données est sécurisée et partagée
          par ses différents utilisateurs, sans intermédiaire, ce qui permet à
          chacun de vérifier la validité de la chaîne. Notre application
          s'appuie sur la Blockchain publique POLYGON, vous offrant la
          confidentialité, la transparence et la sécurité d'une blockchain
          publique éprouvé
        </TextBlock>
        <TextBlock icon={certificateIcon}>
          Les NFT sont l'avenir de la propriété individulle, en effet, grâce à
          cette technologie basée sur les "contrats intelligents", hebergés sur
          la blockchain, obtenez un certificat infalsifiable de votre achat,
          certificat digital de propriété qui atteste du caractère unique de
          votre bien tout en preservant votre vie privé. Le NFT inteligent de
          BikeOnChain est l'altérégo digital de votre vélo, donne a son
          proprietaire toute une palette de functions interactives permetant
          d'intereagir avec votre vélo directement sur le blokchain. Transferez
          votre nft lors de la revente,comme garantie de propriété, Ajouter un
          reparateur de confiance et permetez lui d'inscrire dans le carnet
          d'entretien associé au Nft, les travaux réalisé, Déclarer son vélo
          volé, ou en vente, faite le directement avec votre application
          BikeOnChain
        </TextBlock>
        <TextBlock icon={thiefIcon}>
          Bike on chain s'associé aux plus grandes plateformes de revente de
          vélo d'occasion afin de lutter contre le recel. Affichez le NFT associé
          a votre vélo en tant que garantie de propriété et transferez le nft a
          l'acheteur au moment de la revente. L'état de n'importe quel vélo muni
          d"un nft BoC, est verifiable dans notre moteur de recherche en
          saisisant simplement le numéro de série unique du vélo, en cas de vol
          par exemple,un état volé sera affiché sur le NFT et ce jsuqu' a ce que
          son propriétaire le retrouve
        </TextBlock>
      </div>
    </>
  );
}

export default Home;
