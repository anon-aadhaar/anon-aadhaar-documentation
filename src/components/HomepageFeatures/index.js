import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Generate identity proofs",
    Svg: require("@site/static/img/undraw_anonaadhaar_fingerprint.svg").default,
    description: (
      <>
        Anon Aadhaar circuit lets citizens with an Aadhaar card generate
        zero-knowledge identity proof.
      </>
    ),
  },
  {
    title: "Verify",
    Svg: require("@site/static/img/undraw_anonaadhaar_verify.svg").default,
    description: (
      <>You can verify the generated Anon Aadhaar proofs on and off chain.</>
    ),
  },
  {
    title: "Easy to use",
    Svg: require("@site/static/img/undraw_anonaadhaar_ux.svg").default,
    description: (
      <>
        Anon Aadhaar lets you easily integrate the circuit, thanks to the react
        SDK.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
