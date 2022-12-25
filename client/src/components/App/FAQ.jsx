import { Collapse, Text } from "@nextui-org/react";
import Hero from "./shared/Hero";

function FAQ() {
  return (
    <>
      <Hero>
        <Text h5 css={{ m: 0 }}>
          Où trouver le numéro de série de mon vélo ? Afin de verifier la
          correspondance du nft avec le vélo, vous avez besoin d'une manière de
          pouvoir l'identifier, c'est pourquoi nous vous demandons lors de
          l'achat de votre vélo de toujours vérifier son numéro de série qui est
          le numéro unique sur lequel est frapé notre NFT Tous les vélos ont un
          numéro de série unique qui permet de les identifier. Il se compose en
          général de lettres et de chiffres, et est gravé sur le cadre ou collé
          à l’aide d’une étiquette. Il peut se trouver à différents endroits sur
          le vélo, comme par exemple : Sur la base du cadre du vélo Sous le
          pédalier Sur le tube de la selle, soit en bas, soit à l’arrière Sous
          la batterie (s’il s’agit d’un vélo électrique) Ci-dessous quelques
          examples pour vous aider à trouver votre numéro de série. Le numéro de
          série sur un vélo Sirroco Thompson se trouve en dessous du pédalier.
          Le numéro de série sur un vélo Popal Cooper se trouve en dessous du
          pédalier. Le numéro de série sur un vélo Canyon se trouve en dessous
          du pédalier. Le numéro de série sur un vélo BMC se trouve en dessous
          du pédalier.
        </Text>
      </Hero>
      <Collapse.Group>
        <Collapse title="Question 1">
          <Text>Réponse 1</Text>
        </Collapse>
        <Collapse title="Question 2">
          <Text>Réponse 2</Text>
        </Collapse>
        <Collapse title="Question 3">
          <Text>Réponse 3</Text>
        </Collapse>
      </Collapse.Group>
    </>
  );
}

export default FAQ;
