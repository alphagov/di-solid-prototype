type Uri = string;

export default class AccessGrantVocabulary {
  private readonly vocab: Record<string, Record<string, string>> = {
    resources: {
      "/national-insurance-number/metadata": "National Insurance number",
      "/national-insurance-number/check": "National Insurance number",
    },
    subjects: {
      "https://id.ess.solid.integration.account.gov.uk/urn:fdc:gov.uk:2022:z7Ih7bcHIjZk8-DTyAyOy8LDXUgJKRDXcZdTdDHfptU":
        "Department for Work and Pensions",
    },
    modes: {
      read: "Read",
      write: "Read and write",
    },
    purposes: {
      "https://prototype.solid.integration.account.gov.uk/purposes#write-nino":
        "Save your National Insurance number",
      "https://prototype.solid.integration.account.gov.uk/purposes#read-nino":
        "Read your National Insurance number",
    },
  };

  private readonly webIdRegex =
    /https:\/\/storage\.ess\.solid\.integration\.account\.gov\.uk\/[a-z0-9-]+/;

  getResourcePath(uri: Uri): string {
    return uri.replace(this.webIdRegex, "");
  }

  getResourceNames(resources: Uri[]): string[] {
    /* Returns a deduplicated array of names for the
     * resources in an access grant. This is needed
     * because our VCs are stored as two resources in
     * the pod but we don't need to show its name twice
     */
    const names = [];
    for (let i = 0; i < resources.length; i += 1) {
      names.push(this.vocab.resources[this.getResourcePath(resources[i])]);
    }

    return [...new Set(names)];
  }

  getSubjectName(subject: Uri): string {
    return this.vocab.subjects[subject];
  }

  getAccesModeName(modes: Uri[]): string {
    /* Return a human readble name for the access
     * mode requested, eg. "Read" or "Read and write".
     * If an app wants to write it also needs read
     * permissions, so always upgrade to the highest
     * level requested.
     */

    if (modes.includes("http://www.w3.org/ns/auth/acl#Write")) {
      return this.vocab.modes.write;
    }
    // If it's not write then assume it's read
    return this.vocab.modes.read;
  }

  getPurposeName(purpose: Uri): string {
    // We only support one purpose per access request
    // at the moment
    return this.vocab.purposes[purpose];
  }
}
