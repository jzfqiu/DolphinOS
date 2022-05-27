# Apple&#39;s CSAM Scanning Feature: Choices and Consequences

*Jeff Qiu*

In September 2021, Apple announced that it would implement a client-side scanning feature on Apple devices to detect Child Sexual Abuse Materials (CSAM). Once implemented, Apple devices will generate visual fingerprints for all photos that users select to upload to iCloud. These fingerprints will be compared to a local database of fingerprints generated from known CSAM. The matching results are stored in encrypted &quot;safety vouchers&quot; uploaded to iCloud with the photos. If enough matching occurs, Apple will decrypt the vouchers to manually review its content before reporting the account to authority.

The announcement led to heated debate regarded its implication on technology and policy. Many people are concerned about the feature&#39;s possibility to infringe user privacy, while others argue for the urgency to combat the CSAM pandemic. Here we summarize the main issues in the debate and propose several modifications to the feature&#39;s current design.

## What If Apple Push Through?

Implementing the feature could have significant technical consequences. The client-side scanning scheme Apple proposed decreases the effectiveness of End-to-End Encryption (E2EE) by introducing a new way of identifying content on a user&#39;s device. Although Apple has made significant modifications to existing client-side scanning solutions to preserve users&#39; privacy, such as comparing the visual fingerprints on devices and requiring multiple matches before decrypting user contents, it is still a tool to reveal the user&#39;s private information to a third party. A sophisticated backdoor is still a backdoor. Setting a precedent in pushing backdoor to billions of personal devices is likely not in Apple&#39;s interest, even though we have enough reasons to believe that Apple&#39;s technical proficiency allows the feature to sufficiently preserve an innocent user&#39;s privacy. Not to mention that the backdoor is easily circumventable by simply turning off photo storage on iCloud. For Apple, the feature in its current design would likely catch nothing but controversy.

The policy implication of pushing forward the feature is significant. The strongest policy argument against this feature is that it would lead to a &quot;slippery slope&quot; that expands the scope of scanning into political surveillance. One of the most vocal advocates, the Electronic Frontier Foundation, claimed that it only takes an &quot;expansion in machine learning parameters&quot; or a &quot;tweak of the configuration flags to scan&quot; to turn the feature into a surveillance tool.

Regardless of the technical feasibility, governments may sense an opportunity to require Apple to expand the target of scanning for pollical purposes now that Apple has demonstrated its ability to do so. In many jurisdictions outside of the US, Apple has few legal powers to challenge such requests. For example, Apple might be forced to comply with the Chinese government&#39;s request to scan for politically sensitive content, as it did when Beijing asked Apple to store Chinese users&#39; iCloud data within its border in 2018. Such development would raise serious human rights concerns from Apple device users around the world.

## What If Apple Cancels the Feature?

The current solution is both ineffective against CSAM and has negative implications for privacy on a global scale. Nonetheless, it marks Apple&#39;s one step forward on an important and urgent issue. Several institutions, including the NCMEC, applauded Apple for its initiatives to combat child sexual abuse. The International Justice Mission pointed out that the &quot;slippery slope&quot; argument against the scanning feature is a hypothetical one, while the threat to sexually exploited children around the world is real and present. Taking a step back on this important issue could potentially put more children in danger.

In addition, in lieu of a tech-literate response from Silicon Valley companies, some regulators have proposed more outrageous solutions to the issue. The EARN IT act, first introduced in 2020 and reintroduced this year, offered to hold service providers liable for transmitting CSAM unless they follow a set of practices.

Apple&#39;s proposal represents a practical, best-effort gesture to address the issue. While controversial, it is not as nearly flawed and destructive as the EARN IT act, which would directly impact rights to freedom of speech and digital privacy through encryption. As the party that is closest to the heart of the issue, Apple and other Silicon Valley companies need to preempt Washington on issues related to CSAM. Abandoning the scanning feature will no doubt give Congress more leverage against Silicon Valley.

## How about Doing Something Else?

Weighing the benefit of exposing a small number of criminals in possession of CSAM against the privacy concerns for billions of Apple users, we suggest that Apple abandon implementing the feature. However, several measures could address the concerns related to the current solution while still more effectively dealing with the growing threat of CSAM. Here we discuss one possible alternative strategy.

Currently, many service providers utilize user reports for detecting illegal content on their platforms. This function is simple to implement and does not introduce nuances to the E2EE scheme since only the intended audience can access and report the content. Its prevalence on existing services also means that it is more readily acceptable by users. Google, for example, has already built the reporting system into their public platforms, such as YouTube, as well as private communication services, such as Hangout. Apple, on the other hand, has not implemented such features in its products. Before attempting a more aggressive solution, Apple should first catch up to the existing solutions when it comes to such sensitive issues as CSAM.

[https://www.apple.com/child-safety/pdf/CSAM\_Detection\_Technical\_Summary.pdf](https://www.apple.com/child-safety/pdf/CSAM_Detection_Technical_Summary.pdf)

[https://www.eff.org/deeplinks/2021/08/apples-plan-think-different-about-encryption-opens-backdoor-your-private-life](https://www.eff.org/deeplinks/2021/08/apples-plan-think-different-about-encryption-opens-backdoor-your-private-life)

[https://www.reuters.com/technology/exclusive-apples-child-protection-features-spark-concern-within-its-own-ranks-2021-08-12/](https://www.reuters.com/technology/exclusive-apples-child-protection-features-spark-concern-within-its-own-ranks-2021-08-12/)

[https://www.ijmuk.org/stories/ijms-official-statement-on-apples-child-safety-measures](https://www.ijmuk.org/stories/ijms-official-statement-on-apples-child-safety-measures)

[https://cyberlaw.stanford.edu/blog/2020/07/earn-it-act-threatens-our-online-freedoms-new-amendments-don%E2%80%99t-fix-it](https://cyberlaw.stanford.edu/blog/2020/07/earn-it-act-threatens-our-online-freedoms-new-amendments-don%E2%80%99t-fix-it)

[https://protectingchildren.google/](https://protectingchildren.google/)