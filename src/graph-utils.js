/* Graph Utils
 * @author Yves Menard
 */

const SIMPLIFY_LINKS_MIN = 3;
const BUNDLE_NODE_MIN = 2;

/*
Graph utils

Bundle: create a bundle node
The nodes that has exactly the same in and out links can be group into a bundle

Simplify:
Create simplification nodes in order to limit the number of links to the minimal

 */

class GraphUtils {

    constructor(content) {
        this.nodesById = {};
        this.uniqueId = 1;

        this.nodes = content.nodes;
        this.links = content.links;

        this.createNodesById();

        this.normalizeNodesLinks();
    }

    simplify(content) {
        let computedNodes = this.computeSimplificationNodes();
        this.nodes = computedNodes;
    }

    bundle() {
        let computedNodes = this.computeBundleNodes();
        this.nodes = computedNodes;
    }

    result() {
        return this.denormalizeNodesLinks(this.nodes);
    }

    createNodesById() {
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            this.nodesById[node.id] = node;
        }
    }

    normalizeNodesLinks() {
        for (let i = 0; i < this.links.length; i++) {
            let link = this.links[i];
            let sourceId = link.source;
            let targetId = link.target;

            let sourceNode = this.nodesById[sourceId];
            let targetNode = this.nodesById[targetId];

            if (!sourceNode.links) {
                sourceNode.links = {};
            }

            if (!sourceNode.links[targetId]) {
                sourceNode.links[targetId] = true;
            }

            if (!targetNode.parents) {
                targetNode.parents = {};
            }

            if (!targetNode.parents[sourceId]) {
                targetNode.parents[sourceId] = true;
            }
        }

        /*for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];

            if (node.links) {
                node.links.length = this.getLinksLength(node.links);
            }

            if (node.parents) {
                node.parents.length = this.getLinksLength(node.parents);
            }
        }*/

    }

    denormalizeNodesLinks(computedNodes) {
        let resultNodes = [];
        let resultLinks = [];

        for (let i = 0; i < computedNodes.length; i++) {
            let node = computedNodes[i];

            resultNodes.push(node);

            let links = node.links;

            for (let link in links) {
                if (links[link]) {
                    let targetNode = this.nodesById[link];
                    let simplificationNode = (targetNode.type == "simplification");

                    let resultLink = {
                        source: node.id,
                        target: link
                    };

                    if (simplificationNode) {
                        resultLink.simplification = true;
                    }

                    resultLinks.push(resultLink);
                }
            }

            delete node.links;
            delete node.parents;
        }

        return {
            nodes: resultNodes,
            links: resultLinks
        };
    }

    computeSimplificationNodes() {
        let computedNodes = [];
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            let links = node.links;

            for (let j = 0; j < computedNodes.length; j++) {
                let cNode = computedNodes[j];

                if (cNode == node) {
                    continue;
                }

                let cNodeLinks = cNode.links;

                if (! cNodeLinks) {
                    continue;
                }

                let sharedLinks = this.getSharedLinks(links, cNodeLinks);

                if (sharedLinks && this.getLinksLength(sharedLinks) >= SIMPLIFY_LINKS_MIN) {

                    // in case of simplification node
                    // if (cLinks ⊂ links) (strickly included) no need to create new simplication node
                    // Which can be also written like this cLinks ∩ links = clinks
                    // We already have cLinks ∩ links, which is sharedLinks
                    // Now you test for equality
                    if (cNode.type == "simplification" && this.isEquivalent(sharedLinks, cNodeLinks)) {

                        let simplificationNode = cNode;

                        // remove the node its parents links
                        for (let sharedLink in sharedLinks) {
                            if (sharedLinks[sharedLink]) {
                                if (node.links[sharedLink]) {
                                    let linkNode = this.nodesById[sharedLink];
                                    delete linkNode.parents[node.id];
                                }
                            }
                        }

                        this.removeLinksInLinks(node.links, sharedLinks);

                        node.links[simplificationNode.id] = true;
                        simplificationNode.parents[node.id] = true;

                    } else {

                        let newSimplificationNode = {
                            id: "S" + this.uniqueId++,
                            type: "simplification",
                            parents: {}
                        };

                        newSimplificationNode.parents[node.id] = true;
                        newSimplificationNode.parents[cNode.id] = true;

                        this.nodesById[newSimplificationNode.id] = newSimplificationNode;

                        newSimplificationNode.links = sharedLinks;

                        // remove the node its parents links
                        /*for (let link in node.links) {
                            if (node.links[link]) {
                                let linkNode = this.nodesById[link];
                                linkNode.parents[node.id] = false;
                            }
                        }*/

                        // remove the node its parents links
                        /*for (let link in cNode.links) {
                            if (cNode.links[link]) {
                                let linkNode = this.nodesById[link];
                                linkNode.parents[cNode.id] = false;
                            }
                        }*/

                        for (let simplificationLink in newSimplificationNode.links) {
                            if (newSimplificationNode.links[simplificationLink]) {
                                let simplificationLinkNode = this.nodesById[simplificationLink];
                                if (! simplificationLinkNode.parents) {
                                    simplificationLinkNode.parents = {};
                                }
                                simplificationLinkNode.parents[newSimplificationNode.id] = true;
                                delete simplificationLinkNode.parents[node.id];
                                delete simplificationLinkNode.parents[cNode.id];
                            }
                        }

                        this.removeLinksInLinks(node.links, sharedLinks);
                        this.removeLinksInLinks(cNode.links, sharedLinks);

                        node.links[newSimplificationNode.id] = true;
                        cNode.links[newSimplificationNode.id] = true;

                        computedNodes.push(newSimplificationNode);
                    }
                }
            }

            computedNodes.push(node);
        }

        return computedNodes;
    }

    computeBundleNodes() {
        let computedNodes = [];

        for (let i = 0; i < this.nodes.length; i++) {
            let node1 = this.nodes[i];

            if (node1.type == "simplification" || node1.type == "bundle") {
                computedNodes.push(node1);
                continue;
            }

            if (node1.bundled) {
                continue;
            }

            let links1 = node1.links;
            let parents1 = node1.parents;

            let bundlees = [node1];

            let potentialSiblingsNodes = this.getPotentialSiblingsNodes(node1);

            for (let j = 0; j < potentialSiblingsNodes.length; j++) {
                let node2 = potentialSiblingsNodes[j];
                let links2 = node2.links;
                let parents2 = node2.parents;

                if (node1 == node2) {
                    continue;
                }

                if (this.isEquivalent(links1, links2) && this.isEquivalent(parents1, parents2)) {
                    bundlees.push(node2)
                }
            }

            if (bundlees.length >= BUNDLE_NODE_MIN) {

                let bundleNode = {
                    id: "B" + this.uniqueId++,
                    type: "bundle",
                    links: node1.links,
                    parents: node1.parents,
                    bundlees: bundlees.map((d) => {return d.id;})
                };

                for (let j = 0; j < bundlees.length; j++) {
                    let bundlee = bundlees[j];

                    bundlee.bundled = true;

                    for (let bundleParent in bundleNode.parents) {
                        let bundleParentNode = this.nodesById[bundleParent];
                        delete bundleParentNode.links[bundlee.id];
                        bundleParentNode.links[bundleNode.id] = true;
                    }

                    for (let bundleLink in bundleNode.links) {
                        let bundleLinkNode = this.nodesById[bundleLink];
                        delete bundleLinkNode.parents[bundlee.id];
                        bundleLinkNode.parents[bundleNode.id] = true;
                    }
                }

                this.nodesById[bundleNode.id] = bundleNode;

                computedNodes.push(bundleNode);
            } else {
                computedNodes.push(node1);
            }
        }

        return computedNodes;
    }

    getPotentialSiblingsNodes(node) {

        let result = [];
        
        /*for (let link in node.links) {
            if (node.links[link]) {
                for (let parent in link.parents) {
                    if (link.parents[parent] && parent != node && result.indexOf(parent) < 0 && !parent.bundled) {
                        result.push(parent);
                    }
                }
            }
        }*/

        for (let parent in node.parents) {
            if (node.parents[parent]) {
                let parentNode = this.nodesById[parent];
                for (let link in parentNode.links) {
                    let linkNode = this.nodesById[link];
                    if (parentNode.links[link] && linkNode != node && result.indexOf(linkNode) < 0 && !linkNode.bundled) {
                        result.push(linkNode);
                    }
                }
            }
        }

        return result;
    }

    isEquivalent(a, b) {
        if (a == b || a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }

    getLinksLength(links) {
        let cpt = 0;
        for (let i in links) {
            cpt++;
        }
        return cpt;
    }

    removeLinksInLinks(links1, links2) {
        for (let link2 in links2) {
            if (links2[link2] && links1[link2]) {
                delete links1[link2];
            }
        }
    }

    getSharedLinks(links1, link2) {
        let sameLinks = {};
        for (let link1 in links1) {
            if (links1[link1] && link2[link1]) {
                sameLinks[link1] = true;
            }
        }
        return sameLinks;
    }
}

module.exports = GraphUtils;