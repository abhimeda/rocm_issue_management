import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const core = require('@actions/core');
const github = require('@actions/github');

const osDelim = "### Operating System"
        const cpuDelim = "### CPU"
        const gpuDelim = "### GPU"
        const rocmVersionDelim = "### ROCm Version"
        const rocmComponentDelim = "### ROCm Component"

const orgName = core.getInput('github-organization', {required: true})
const repo = core.getInput('github-repo', {required: true})

const extractInfo = async (octokit, body, issueNum) => {
    let osIndex = body.indexOf(osDelim) + osDelim.length + 2
    let cpuIndex = body.indexOf(cpuDelim) - 2
    
    const os = body.slice(osIndex, cpuIndex)
    
    cpuIndex = body.indexOf(cpuDelim) + cpuDelim.length + 2
    let gpuIndex = body.indexOf(gpuDelim) - 2

    const cpu = body.slice(cpuIndex, gpuIndex)

    gpuIndex = body.indexOf(gpuDelim) + gpuDelim.length + 2
    let rocmVersionIndex = body.indexOf(rocmVersionDelim) - 2

    let gpu = body.slice(gpuIndex, rocmVersionIndex)

    rocmVersionIndex = body.indexOf(rocmVersionDelim) + rocmVersionDelim.length + 2
    let rocmComponentIndex = body.indexOf(rocmComponentDelim) - 2

    let rocmVersion = body.slice(rocmVersionIndex, rocmComponentIndex)
    gpu = gpu.split(",").map(version => {
        return version.trim()
    })
    rocmVersion = rocmVersion.split(",").map(version => {
        return version.trim()
    })
    let labels = gpu.concat(rocmVersion)
    await octokit.rest.issues.addLabels({owner: orgName, repo: repo, issue_number:issueNum, labels:labels})
    console.table([os, cpu, gpu, rocmVersion])

    }


const thingy  = async () => { 

    try{

        const githubToken = core.getInput('authentication-token', {required: true})
        const octokit = github.getOctokit(githubToken);
        const contextPayload = github.context.payload;
        const body = contextPayload.issue.body
        const num = contextPayload.issue.number
        console.log("JSON contextPayload.issue:  ",JSON.stringify(contextPayload.issue))
        extractInfo(octokit, body, num)
        }catch (error) {
            core.setFailed(error.message);
        }

}
thingy()