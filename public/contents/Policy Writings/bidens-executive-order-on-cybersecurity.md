# Biden&#39;s Executive Order on Cybersecurity: A Terrific Starting Point

*Jeff Qiu*

The EO issued several requirements that will vastly improve the agencies&#39; cybersecurity. **Although some of these measures require considerable effort and time to implement properly, the EO is a much-needed starting point that pushes the federal government and IT service providers towards better security.**

## The Current State of Cybersecurity in Federal Agencies

When the president issued the executive order (EO), civilian federal agencies were vastly underprepared for the cybersecurity risk they face from foreign adversaries. A 2019 senate overview of Inspector General&#39;s reports found that seven out of eight inspected agencies did no protect personally identifiable information, four of the agencies did not know what applications were running on their internal network, and all eight agencies ran on legacy software that is no longer supported by vendors. **The current state of cybersecurity in civilian federal agencies is extremely concerning.**

This raises two issues. First, agencies that do not directly oversee national security issues can become targets of attack. In February 2021, Chinese hackers allegedly breached USDA&#39;s payroll system, gaining access to thousands of employee records.Second, adversaries may use an unprotected agency&#39;s system as an entry point to a more secure system. While each agency&#39;s systems remain independent, an adversary could use a compromised system to gain access to uncompromised systems through a technique known as lateral movement. **Securing these agencies&#39; systems is crucial to ensuring the country&#39;s national security.**

## Section 2: Removing Barriers to Sharing Threat Information

This section mandates that all service providers for federal agencies report cyber incidents and share data with investigators. The requirements include collecting and preserving data relevant to cyber incidents, enabling sharing of said data, and offering necessary assistance with investigators. **Implementing these provisions will improve the federal government&#39;s capability to detect and respond to potential cyber exploits and cyberattacks, establishing a baseline level of cybersecurity across all agencies.**

Data collection and sharing are crucial when investigating a potential cyber incident. Adequate documentation of information such as network activities and access records could reveal the early signs of an intrusion, allowing agencies to prevent a possible attack. The data also helps investigators determine the damage and scope of the attack if the adversaries were successful.

The consequences of inadequate data collection are best observed in the 2015 OPM breach. A congress report showed that OPM&#39;s limited network logging capability between 2012 and 2014 led them to overlook suspicious activity within the system, enabling attackers to remain hidden in the network for almost two years. Clause (c) of the EO addresses this by mandating service providers for federal agencies to collect and maintain all data relevant to cybersecurity incidents. This section complements Section 7 of the EO, which requires endpoint detection, and section 8, which outlines the format of data records, to hold agencies&#39; data collection effort up to industry standard.

In addition, federal investigators often lack legal standings to retrieve data from service providers that have been breached. Contractual language before the EO does not mandate service providers to share data with federal agencies, allowing service providers to conceal suspicious cyber activities within their network and delay preventive measures to protect their business interests. Clause (f) of the EO order revision of the contract languages such that service providers will need to report data with national security agencies promptly.

## Section 3: Modernizing Federal Government Cybersecurity

This section requests federal agencies to implement a variety of cybersecurity measures. These measures include adopting multi-factor authentications (MFA), implementing Zero Trust Architecture, and migrating services to cloud platforms. **These measures could significantly enhance the federal government&#39;s cyber defense capability and save tremendous resources in system maintenance and development. However, proper implementations are crucial to avoid additional risks.**

### Adopting Zero Trust Architecture and Multi-factor Authentication (MFA)

Previously, most federal agencies utilized a perimeter-focused approach to cybersecurity: traffic coming in and out of an agency&#39;s network is closely monitored, but a single authentication allows a user to access all recourses within the network. However, a single line of defense at the edge of the network is easily penetrable. Zero Trust Architecture requires users to be authenticated and continuously validated to access sensitive resources regardless of their location on the internet. MFA complement the model by asking the users to authenticate with additional methods, such as biometric authentication, to supplement password and username, which are known to be vulnerable.

While these measures drastically increase the cost of unauthorized access in protected systems, an advanced and persistent opponent can still slip through. In the SolarWinds attack, adversaries backed by the Russian government bypassed MFA through a design flaw in Microsoft Outlook. They also used an over-permissioned service account to move laterally within the network. These exploits require a high level of technical proficiency and threat intelligence, typically only seen in state-sponsored groups.

Despite the flaws, these measures will improve the defense capacity of federal agencies in a meaningful way. The purpose of these measures is not to eradicate attacks but to first eliminate the &quot;low hanging fruits.&quot; Many federal agencies, such as the Department of Education, struggled to implement meaningful single-factor authentication. Therefore, upgrading to MFA and Zero Trust is already a significant improvement. These measures will also raise the cost of an attack high enough to slow down adversaries, providing investigators valuable opportunities to impede, detect, and expose the adversaries before data is exfiltrated.

### Migrating to Cloud Platforms

This measure has two significant advantages. First, it will drastically decrease the infrastructure cost for federal agencies. A 2017 survey of IT executives showed that 47% of respondents decreased their IT cost by 30% to 50% after moving to cloud platforms.

Besides, most federal agencies run on legacy systems that are costly to maintain and upgrade. Moving the cloud platform allows agencies to quickly run on the latest technologies without spending resources to develop software on their own. Second, cloud platforms are easier to secure. Most cloud vendors offer well-developed, automated security tools integrated into cloud services. Compared to on-premises security tools, cloud security tools generally require less expertise to operate and less effort to achieve the same level of security, which is especially beneficial for federal agencies struggling to retain cyber talents.

However, cloud services are not bulletproof. While the vendor&#39;s architectures are generally secure, users or even the vending company&#39;s employees can misuse or abuse them. The 2021 Twitch data leak, for example, was caused by a server misconfiguration; in two separate incidents, disgruntled Amazon employees shared sensitive data with unauthorized parties in 2020.

The EO does not mention these specific risks, but clause (c) orders agencies to develop a &quot;Federal cloud-security strategy&quot; to address potential issues. In addition, while the industry solution for cloud migration is relatively mature, the volume and sensitivity of governmental data could present new challenges. If these issues are mitigated in the implementation stage, cloud platforms could be tremendously beneficial for the federal government&#39;s cybersecurity.

## Section 4: Enhancing Software Supply Chain Security

This section outlines security standards for software vendors to federal governments and mandates more detailed disclosure of software vendors&#39; compliance to these security standards. **These requirements will create a strong incentive for software vendors to enhance their security measures, improving the overall security of the software supply chain.**

The first goal of the section is to issue guidance to software vendors on securing software development environments. The guidance includes documenting dependencies, verifying the integrity of software build, and using automated tools to check for vulnerabilities. Most of these practices are already standard practices for industry leaders such as Google and recommended by most industry guidelines; the EO is simply pushing for broader implementation with policy requirements.

The second goal of the section is more detailed disclosures of security practices from vendors through the Software Bill of Material (SBOM). Analogous to a nutrition label for software, the SBOM provides greater visibility to the federal government regarding possible vulnerabilities in the products they purchase. This information will help speed up investigations should an incident occurs. The mandate also provides an incentive for vendors to implement more security features to improve their product&#39;s competitiveness in the market, as buyers would prefer more secure products.

A concern raised regarding this section is that these security requirements may distort the software vendor market since the requirement for the federal government only to purchase software that satisfies security requirements will incur a cost on software vendors. First, while implementations may require a non-trivial amount of investment, doing so will help software vendors in the long-term saving on expenses related to attacks. Second, it is time for the federal government to prioritize national security over market efficiency, as cyberattacks are becoming more frequent in recent years. Overall, as the biggest purchaser of IT service in the US, the federal government can and should utilize its overwhelming market power to induce changes in the industry for better security, and this EO is a great place to start.

## References

[https://www.hsgac.senate.gov/imo/media/doc/2019-06-25%20PSI%20Staff%20Report%20-%20Federal%20Cybersecurity%20Updated.pdf](https://www.hsgac.senate.gov/imo/media/doc/2019-06-25%20PSI%20Staff%20Report%20-%20Federal%20Cybersecurity%20Updated.pdf)

[https://thehill.com/policy/cybersecurity/537067-us-payroll-agency-targeted-by-chinese-hackers-report](https://thehill.com/policy/cybersecurity/537067-us-payroll-agency-targeted-by-chinese-hackers-report)

[https://attack.mitre.org/tactics/TA0008/](https://attack.mitre.org/tactics/TA0008/)

[https://republicans-oversight.house.gov/wp-content/uploads/2016/09/The-OPM-Data-Breach-How-the-Government-Jeopardized-Our-National-Security-for-More-than-a-Generation.pdf](https://republicans-oversight.house.gov/wp-content/uploads/2016/09/The-OPM-Data-Breach-How-the-Government-Jeopardized-Our-National-Security-for-More-than-a-Generation.pdf)

[https://techcrunch.com/2021/10/07/doj-will-sue-federal-contractors-that-hide-cyberattacks-and-breaches/](https://techcrunch.com/2021/10/07/doj-will-sue-federal-contractors-that-hide-cyberattacks-and-breaches/)

[https://www.securityweek.com/group-behind-solarwinds-hack-bypassed-mfa-access-emails-us-think-tank](https://www.securityweek.com/group-behind-solarwinds-hack-bypassed-mfa-access-emails-us-think-tank)

[https://www.crowdstrike.com/cybersecurity-101/zero-trust-security/](https://www.crowdstrike.com/cybersecurity-101/zero-trust-security/)

[https://www.hsgac.senate.gov/imo/media/doc/2019-06-25%20PSI%20Staff%20Report%20-%20Federal%20Cybersecurity%20Updated.pdf](https://www.hsgac.senate.gov/imo/media/doc/2019-06-25%20PSI%20Staff%20Report%20-%20Federal%20Cybersecurity%20Updated.pdf)

[https://www.techrepublic.com/article/report-84-of-it-pros-will-move-more-workloads-to-the-cloud-by-2019-for-cost-savings-flexibility/](https://www.techrepublic.com/article/report-84-of-it-pros-will-move-more-workloads-to-the-cloud-by-2019-for-cost-savings-flexibility/)

[https://www.dnsstuff.com/cloud-vs-on-premise-security](https://www.dnsstuff.com/cloud-vs-on-premise-security)

[https://firewalltimes.com/amazon-data-breach-timeline/](https://firewalltimes.com/amazon-data-breach-timeline/)

[https://cloud.google.com/blog/products/application-development/google-introduces-slsa-framework](https://cloud.google.com/blog/products/application-development/google-introduces-slsa-framework)