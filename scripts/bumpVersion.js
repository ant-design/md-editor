#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const RELEASE_KEYWORDS = Object.freeze(['feat', 'new']);
const VERSION_COMMANDS = Object.freeze({
  feature: 'npm version minor',
  patch: 'npm version patch',
});
const COMMIT_SEPARATOR = '\u001d';
const LOG_FORMAT = `%B%x1d`;

function readLatestTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    }).trim();
    return tag || null;
  } catch (error) {
    const stderr = String(error.stderr ?? '').trim();

    if (
      stderr.includes('No names found') ||
      stderr.includes('fatal: No tags can describe')
    ) {
      return null;
    }

    console.error(
      '无法读取最新标签，请确认当前目录为 Git 仓库且存在有效标签。',
    );
    process.exit(error.status ?? 1);
  }
}

function readCommitMessagesSince(tag) {
  const baseCommand = tag
    ? `git log ${tag}..HEAD --pretty=${LOG_FORMAT}`
    : `git log --pretty=${LOG_FORMAT}`;

  try {
    const output = execSync(baseCommand, { encoding: 'utf8' });
    if (!output) {
      return [];
    }

    return output
      .split(COMMIT_SEPARATOR)
      .map((message) => message.trim())
      .filter((message) => message.length > 0);
  } catch (error) {
    console.error('无法读取提交信息，请确认当前目录为 Git 仓库。');
    process.exit(error.status ?? 1);
  }
}

function containsReleaseKeyword(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return false;
  }

  return messages.some((message) => {
    const lowerCaseMessage = message.toLowerCase();
    return RELEASE_KEYWORDS.some((keyword) =>
      lowerCaseMessage.includes(keyword),
    );
  });
}

function pickVersionCommand(messages) {
  return containsReleaseKeyword(messages)
    ? VERSION_COMMANDS.feature
    : VERSION_COMMANDS.patch;
}

function runVersionCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`执行 "${command}" 失败。`, error);
    process.exit(error.status ?? 1);
  }
}

function main() {
  const latestTag = readLatestTag();
  const commitMessages = readCommitMessagesSince(latestTag);
  const command = pickVersionCommand(commitMessages);

  if (latestTag) {
    console.log(`上一个标签: ${latestTag}`);
  } else {
    console.log('仓库尚未创建标签，将检查全部提交。');
  }

  if (commitMessages.length === 0) {
    console.log('未检测到自上一个标签以来的新提交，默认执行补丁版本号。');
  } else {
    console.log('自上一个标签以来的提交信息:');
    commitMessages.forEach((message, index) => {
      console.log(`[${index + 1}] ${message}`);
    });
  }

  console.log(`触发命令: ${command}`);

  runVersionCommand(command);
}

main();
