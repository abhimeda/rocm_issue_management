/**
 * @param {Object} octokit
 * @param {Object} context
 */
const runAction = async (octokit, contextPayload) => {
    
    issueNumber = contextPayload.issue?.number

    console.log(contextPayload.repository_owner)
    console.log(contextPayload.repository)
    if (!issueNumber) {
        throw new Error(`Couldn't find issue info in current context`);
    }
    
    const nodeId = issueNumber
    return `issueNumber:${issueNumber}, `
}

module.exports = {
    runAction
};