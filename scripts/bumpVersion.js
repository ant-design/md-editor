#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const RELEASE_KEYWORDS = Object.freeze(['feat', 'new']);
const VERSION_COMMANDS = Object.freeze({
  feature: 'npm version minor',
  patch: 'npm version patch',
});

function readLatestCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('无法读取最新提交信息，请确认当前目录为 Git 仓库。');
    process.exit(error.status ?? 1);
  }
}

function containsReleaseKeyword(message) {
  if (!message) {
    return false;
  }

  const lowerCaseMessage = message.toLowerCase();
  return RELEASE_KEYWORDS.some((keyword) => lowerCaseMessage.includes(keyword));
}

function pickVersionCommand(message) {
  return containsReleaseKeyword(message)
    ? VERSION_COMMANDS.feature
    : VERSION_COMMANDS.patch;
}

function runVersionCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`执行 "${command}" 失败。`);
    process.exit(error.status ?? 1);
  }
}

function main() {
  const latestCommitMessage = readLatestCommitMessage();
  const command = pickVersionCommand(latestCommitMessage);

  console.log(`最新提交信息: ${latestCommitMessage}`);
  console.log(`触发命令: ${command}`);

  runVersionCommand(command);
}

main();
