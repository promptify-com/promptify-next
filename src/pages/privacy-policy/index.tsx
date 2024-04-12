import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { theme } from "@/theme";

export default function NotFound() {
  return (
    <Layout footer>
      <Box
        sx={{
          p: "60px 24px",
          mt: { xs: theme.custom.headerHeight.xs, md: 0 },
        }}
      >
        <Stack
          gap={3}
          sx={{
            maxWidth: "1184px",
            width: { xs: "100%", md: "50%" },
            m: "auto",
          }}
        >
          <Typography
            fontSize={{ xs: 32, md: 42 }}
            fontWeight={500}
            color={"onSurface"}
          >
            Privacy Policy
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "onSurface",
            }}
          >
            <Avatar
              src={defaultAvatar.src}
              alt={"Promptify"}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
              }}
            />
            Promptify
          </Stack>
          <Typography
            fontSize={12}
            fontWeight={400}
            color={"onSurface"}
          >
            ℹ️ Updated: June 23, 2023
          </Typography>
          <Stack
            sx={{
              fontSize: { xs: 14, md: 12 },
              fontWeight: 400,
              color: "onSurface",
              lineHeight: "160%",
              "& p, & ul, & ol": {
                mt: 0,
              },
              "& h1,& h2,& h3, & h4": {
                fontWeight: 500,
                mb: "10px",
                lineHeight: "140%",
              },
              "& h2": {
                fontSize: { xs: 24, md: 20 },
                mt: "30px",
                mb: "20px",
              },
              "& h3": {
                fontSize: { xs: 20, md: 16 },
              },
              "& h4": {
                fontSize: { xs: 20, md: 14 },
              },
              "& a": {
                textDecoration: "none",
                color: "inherit",
                ":hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            <Box component={"p"}>
              Promptify LLC, along with its affiliates (&quot;Promptify&quot;, &quot;Promptify.com&quot;,
              &quot;we&quot;, &quot;us&quot; or &quot;our&quot;), respects your privacy and is dedicated to safeguarding
              any information we gather from you or about you. This Privacy Policy outlines how we handle Personal
              Information that we accumulate when you use our website, applications, and services (collectively,
              &quot;Services&quot;). This policy does not apply to content that we process on behalf of our business
              customers, such as through our API. Such data usage is governed by the customer agreements for access and
              use of these offerings. To understand how we gather and utilize training information for the development
              of our language models that power ChatGPT and other Services, and to know your choices regarding that
              information, please refer to this help center article.
              <br />
              <br />
              To understand how we gather and utilize training information for the development of our language models
              that power ChatGPT and other Services, and to know your choices regarding that information, please refer
              to this help center article.
            </Box>
            <Box component={"h2"}>1. Collection of Personal Information</Box>
            <Box component={"p"}>
              We collect personal information that relates to you (“Personal Information”) in the following ways:
            </Box>
            <Box component={"h4"}>Information You Provide:</Box>
            <Box component={"p"}>
              We gather Personal Information when you create an account for our Services or interact with us:
            </Box>
            <Box component={"h4"}>Account Details</Box>
            <Box component={"p"}>
              We collect information associated with your account, including your name, contact information, account
              credentials, payment card information, and transaction history, termed as &quot;Account Information.&quot;
            </Box>
            <Box component={"h4"}>User Content:</Box>
            <Box component={"p"}>
              We collect Personal Information included in the input, file uploads, or feedback that you provide to our
              Services (&quot;Content&quot;).Communication Data: If you interact with us, we collect your name, contact
              details, and the content of any messages you send, referred to as &quot;Communication Information.&quot;
            </Box>
            <Box component={"h4"}>Social Media Details:</Box>
            <Box component={"p"}>
              We maintain pages on social media platforms like Google, Gmail, Discord, Github, Instagram, Facebook,
              Medium, Twitter, YouTube, Microsoft and LinkedIn. When you engage with our social media pages, we collect
              Personal Information that you choose to provide to us, such as your contact details (&quot;Social
              Information&quot;). Additionally, the companies hosting our social media pages may provide us with
              aggregate information and analytics regarding our social media activity.Information We Receive
              Automatically: When you visit, use, or interact with our Services, we receive information about your
              visit, use, or interactions, known as &quot;Technical Information&quot;:
            </Box>
            <Box component={"h4"}>Log Data:</Box>
            <Box component={"p"}>
              Information that your browser automatically sends when you use our Services. This includes your Internet
              Protocol address, browser type and settings, the date and time of your request, and how you interact with
              our website.Usage Data: We may automatically gather information about your usage of the Services, such as
              the types of content you view or engage with, the features you use, the actions you take, your time zone,
              country, dates and times of access, user agent and version, type of computer or mobile device, and your
              computer connection.Device Information: Includes the device&apos;s name, operating system, device
              identifiers, and the browser you are using. The collected information may vary depending on the type of
              device you use and its settings.
            </Box>
            <Box component={"h4"}>Cookies:</Box>
            <Box>
              We use cookies to operate and administer our Services, and to improve your user experience. A
              &quot;cookie&quot; is a piece of information sent to your browser by a website you visit. You can set your
              browser to accept all cookies, reject all cookies, or notify you whenever a cookie is offered so you can
              decide each time whether to accept it. However, refusing a cookie may, in some cases, prevent you from
              using or negatively affect the display or function of a website or certain areas or features of a website.
              For more information on cookies, please visit All About Cookies.Analytics: We may use a variety of online
              analytics products that use cookies to help us analyze how users use our Services and to enhance your
              experience when using the Services.
              <br />
              <br />
              <Box component={"ul"}>
                <Box component={"li"}>To provide, administer, maintain, and/or analyze the Services.</Box>
                <Box component={"li"}>To improve our Services and conduct research.</Box>
                <Box component={"li"}>To communicate with you.</Box>
                <Box component={"li"}>To develop new programs and services.</Box>
                <Box component={"li"}>To enforce our Terms of Service and other usage policies.</Box>
                <Box component={"li"}>To protect the rights, property, or safety of us, our users, or others.</Box>
                <Box component={"li"}>
                  To comply with legal or regulatory requirements, and to respond to lawful requests, court orders, and
                  legal processes.
                </Box>
              </Box>
            </Box>
            <Box component={"h2"}>2. Disclosure of Personal Information</Box>
            <Box>
              We may disclose your Personal Information in the following situations:
              <br />
              <br />
              <Box component={"ul"}>
                <Box component={"li"}>To our subsidiaries and affiliates.</Box>
                <Box component={"li"}>
                  To our contractors, service providers, and other third parties we use to support our Services.
                </Box>
                <Box component={"li"}>
                  To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization,
                  dissolution, or other sale or transfer of some or all of our assets.
                </Box>
                <Box component={"li"}>
                  To fulfill the purpose for which you provide it.For any other purpose disclosed by us when you provide
                  the information.
                </Box>
              </Box>
            </Box>
            <Box component={"h2"}>3. Disclosure of personal information</Box>
            <Box>
              To comply with any court order, law, or legal process, including to respond to any government or
              regulatory request.
              <br />
              <br />
              <Box component={"ol"}>
                <Box component={"li"}>
                  Security of Personal InformationWe use various security measures to protect your Personal Information.
                  These measures include technical, administrative, and physical security measures that are designed to
                  protect your information from unauthorized access, disclosure, use, and modification.
                </Box>
                <Box component={"li"}>
                  Children’s PrivacyOur Services are not directed towards children under the age of 13 and we do not
                  knowingly collect personal information from children under 13. If you are under 13, please do not use
                  our Services or provide us with any personal information.
                </Box>
                <Box component={"li"}>
                  Changes to Privacy PolicyWe may revise our Privacy Policy from time to time. The most current version
                  of the Privacy Policy will govern our use of your Personal Information and will be located on our
                  website.
                </Box>
                <Box component={"li"}>
                  Contact InformationFor any questions, comments, or concerns about this Privacy Policy, please contact
                  us at: <a href="mailto:privacy@promptify.com">privacy@promptify.com</a>
                </Box>
              </Box>
            </Box>
            <Box component={"h2"}>4. Your Rights</Box>
            <Box>
              Depending on your location, individuals in the EEA, the UK, and globally may have certain legal rights
              with regard to their Personal Information. These rights may include:
              <br />
              <br />
              <Box component={"ul"}>
                <Box component={"li"}>
                  Access to your Personal Information and information regarding how it is processed.
                </Box>
                <Box component={"li"}>The ability to delete your Personal Information from our records.</Box>
                <Box component={"li"}>The ability to rectify or update your Personal Information.</Box>
                <Box component={"li"}>
                  The ability to transfer your Personal Information to a third party (also known as data portability).
                </Box>
                <Box component={"li"}>The ability to restrict how we process your Personal Information.</Box>
                <Box component={"li"}>
                  The right to withdraw your consent at any time, if we rely on consent as the legal basis for
                  processing.
                </Box>
                <Box component={"li"}>The right to object to how we process your Personal Information.</Box>
                <Box component={"li"}>The ability to lodge a complaint with your local data protection authority.</Box>
                <Box component={"li"}>
                  Some of these rights can be exercised through your Promptify account. If you&apos;re unable to
                  exercise your rights through your account, please direct your request to our designated email.
                </Box>
              </Box>
              <br />
              <b>A Note on Accuracy:</b> Services like ours generate responses by interpreting a user&apos;s request and
              predicting the words most likely to appear next. In certain cases, the words most likely to appear next
              may not be the most factually accurate. Therefore, you shouldn&apos;t rely on the factual accuracy of our
              model outputs. If you notice any factual inaccuracies about you in the model outputs and would like us to
              correct them, you may submit a correction request to our designated email. Due to the technical complexity
              of our models, we might not always be able to correct inaccuracies. In such cases, you may request that we
              remove your Personal Information from the model&apos;s output by completing a specific form.
              <br />
              <br />
              For information on exercising your rights in relation to data we&apos;ve collected from the internet to
              train our models, please refer to this help center article.
            </Box>
            <Box component={"h2"}>5. Additional Disclosures for U.S. States</Box>
            <Box>
              The following table offers more details about the categories of Personal Information we gather and how we
              disclose that information. You can find further information about the Personal Information we collect in
              the section &quot;Personal Information We Collect&quot; above, our use of Personal Information in the
              &quot;How We Use Personal Information&quot; section above, and our retention of Personal Information in
              the &quot;Security and Retention&quot; section below.
              <br />
              <br />
              Category of Personal InformationDisclosure of Personal InformationIdentifiers, such as your name, contact
              details, IP address, and other device identifiersWe disclose this information to our affiliates, vendors
              and service providers, law enforcement, and parties involved in Transactions.Commercial Information, such
              as your transaction historyWe disclose this information to our affiliates, vendors and service providers,
              law enforcement, and parties involved in Transactions.Network Activity Information, such as Content and
              how you interact with our ServicesWe disclose this information to our affiliates, vendors and service
              providers, law enforcement, and parties involved in Transactions.Geolocation DataWe disclose this
              information to our affiliates, vendors and service providers, law enforcement, and parties involved in
              Transactions.Your account login credentials and payment card information (Sensitive Personal
              Information)We disclose this information to our affiliates, vendors and service providers, law
              enforcement, and parties involved in Transactions.
              <br />
              <br />
              As a response to local regulations and in accordance with relevant exceptions, individuals can exercise
              the following privacy rights in relation to their Personal Information when using Promptify.com:
              <br />
              <br />
              <Box component={"ul"}>
                <Box component={"li"}>
                  You have the right to know how we process your Personal Information, and to access the specific pieces
                  of Personal Information we&apos;ve collected from you;
                </Box>
                <Box component={"li"}>You have the right to request the deletion of your Personal Information;</Box>
                <Box component={"li"}>
                  You have the right to correct any inaccuracies in your Personal Information; and
                </Box>
                <Box component={"li"}>
                  You have the right to not be discriminated against when exercising any of your privacy rights.
                </Box>
                <Box component={"li"}>
                  At Promptify LLC, we don&apos;t &quot;sell&quot; Personal Information or &quot;share&quot; Personal
                  Information for cross-contextual behavioral advertising (in compliance with definitions under local
                  law). Furthermore, we don&apos;t process sensitive Personal Information to infer characteristics about
                  a user.
                </Box>
              </Box>
              How to Exercise Your Rights: To exercise the privacy rights outlined above, you can submit a request to{" "}
              <a href="mailto:privacy@promptify.com">privacy@promptify.com</a>, provided these rights apply under local
              law.
              <Box component={"h3"}>Verification:</Box>
              We may ask you to verify your credentials to protect your Personal Information from unauthorized access,
              alteration, or deletion. This verification will be necessary when submitting a request to access, correct,
              or delete Personal Information. If you don&apos;t have an account with us, or if we suspect fraudulent or
              malicious activity, we may request additional Personal Information and proof of residency for verification
              purposes. If we cannot verify your identity, we may be unable to fulfill your request.
              <Box component={"h3"}>Authorized Agents:</Box>
              You may also choose to submit a rights request through an authorized agent. In such cases, the agent must
              provide signed written permission to act on your behalf. You may also be required to verify your identity
              independently and submit proof of residency with us. Requests via authorized agents can be submitted to{" "}
              <a href="mailto:privacy@promptify.com">privacy@promptify.com</a>.<Box component={"h3"}>Appeals:</Box>
              Depending on your location, you may have the right to appeal our decision relating to requests to exercise
              your rights under local law. To appeal a decision, please send your request to{" "}
              <a href="mailto:privacy@promptify.com">privacy@promptify.com</a>.
            </Box>
            <Box component={"h2"}>6. Children</Box>
            <Box component={"p"}>
              Our services at <a href="https://www.promptify.com/">Promptify.com</a> are not aimed at children under the
              age of 13. Promptify LLC does not intentionally collect Personal Information from children below this age.
              If you believe a child under 13 has provided us with Personal Information via our services, please get in
              touch at legal@promptify.com. We will look into any such cases and, if necessary, remove the Personal
              Information from our systems. If you are aged 13 or above but under 18, you must obtain consent from your
              parent or guardian to use our services.
            </Box>
            <Box component={"h2"}>7. Links to Other Websites</Box>
            <Box component={"p"}>
              Our Service may include links to websites not operated or controlled by Promptify LLC, including social
              media services (“Third Party Sites”). The information you share with these Third Party Sites is governed
              by their own privacy policies and terms of service, not by this Privacy Policy. We offer these links
              without implying endorsement or approval of these sites. Please contact these Third Party Sites directly
              for details on their privacy practices and policies.
            </Box>
            <Box component={"h2"}>8. Security and Retention</Box>
            <Box component={"p"}>
              We adopt commercially reasonable measures - technical, administrative, and organizational - to safeguard
              Personal Information online and offline against loss, misuse, and unauthorized access, alteration, or
              destruction. However, remember that no Internet or email transmission is ever fully secure or error-free.
              Hence, take special care when deciding what information you send us via the Service or email. We
              can&apos;t be held responsible for the circumvention of any privacy settings or security measures in the
              Service or third-party websites.
              <br />
              <br />
              We retain your Personal Information only as long as necessary to provide our Service, or for other valid
              business purposes such as resolving disputes, ensuring safety and security, or complying with legal
              obligations. The length of retention depends on several factors, including the amount, nature, and
              sensitivity of the information, the potential risk of harm from unauthorized use or disclosure, our
              processing purpose, and any legal requirements.
            </Box>
            <Box component={"h2"}>9. International Users</Box>
            <Box>
              By using our Service, you understand and accept that your Personal Information will be processed and
              stored in our facilities and servers in the United States and may be disclosed to our service providers
              and affiliates in other jurisdictions.
              <br />
              <br />
              For EEA, UK, or Swiss users:
              <br />
              <br />
              Legal Basis for Processing. Our legal bases for processing your Personal Information include:
              <br />
              <Box component={"ul"}>
                <Box component={"li"}>
                  Performance of a contract with you when we provide and maintain our Services. This includes processing
                  Account Information, Content, and Technical Information solely to provide our Services. If you do not
                  provide this information, we may not be able to provide our Services to you.
                </Box>
                <Box component={"li"}>
                  Our legitimate interests in protecting our Services from abuse, fraud, or security risks, or in
                  developing, improving, or promoting our Services, including when we train our models. This may include
                  the processing of Account Information, Content, Social Information, and Technical Information.
                </Box>
                <Box component={"li"}>
                  Your consent when we ask for your consent to process your Personal Information for a specific purpose.
                  You have the right to withdraw your consent at any time.
                </Box>
                <Box component={"li"}>
                  Compliance with our legal obligations when we use your Personal Information to comply with applicable
                  law or protect our rights, safety, and property or those of our affiliates, users, or third parties.
                </Box>
              </Box>
              <br />
              EEA and UK Representative: We have appointed representatives in the EEA and UK for data protection
              matters. You can contact them at <a href="mailto:eu-privacy@promptify.com">eu-privacy@promptify.com</a>.
              <Box component={"h4"}>Data Transfers:</Box>
              <Box component={"p"}>
                As needed, we&apos;ll use appropriate safeguards for transferring Personal Information outside of the
                EEA, Switzerland, and the UK. We will only transfer Personal Information using a legally valid transfer
                mechanism. For more details on these safeguards and to get a copy of them, please contact us at the
                provided contact details.
              </Box>
              <Box component={"h4"}>Data Controller:</Box>
              <Box component={"p"}>
                For the purposes of the UK and EU General Data Protection Regulation 2018, the data controller is
                Promptify LLC.
              </Box>
              <Box component={"h4"}>Data Protection Officer:</Box>
              <Box component={"p"}>
                You can reach out to our data protection officer at{" "}
                <a href="mailto:privacy@promptify.com">privacy@promptify.com</a> regarding matters related to Personal
                Information processing.
              </Box>
            </Box>
            <Box component={"h2"}>10. Changes to the Privacy Policy</Box>
            <Box component={"p"}>
              We may make changes to this Privacy Policy as needed. Whenever we do, we&apos;ll post the updated version
              right here, unless another kind of notice is needed by the law.
            </Box>
            <Box component={"h2"}>11. How to Contact Us</Box>
            <Box component={"p"}>
              If you have questions or concerns that we haven&apos;t covered in this Privacy Policy, please contact{" "}
              <a href="mailto:privacy@promptify.com">privacy@promptify.com</a>. We&apos;re here to help!
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Privacy Policy",
      description: SEO_DESCRIPTION,
    },
  };
}
