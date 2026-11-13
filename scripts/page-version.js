import sitePackage from "../package.json" with { type: "json" };

document.getElementById("site-version").textContent = `v${sitePackage.version}`;
