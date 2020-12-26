import path from 'path'
import os from 'os'

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const withPath = (...pathList: string[]) => path.resolve(...pathList.filter(i => i))

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const joinPath = (...pathList: string[]) => path.join(...pathList.filter(i => i))

/**
 * 当前工作目录（current working directory）
 */
export const CWD = process.cwd()

/**
 * 基于当前工作目录的相对路径
 * @param {String[]} pathList 路径
 */
export const cwdPath = (...pathList: string[]) => path.resolve(CWD, ...pathList.filter(i => i))

/**
 * 基于当前工作目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export const cwdNmPath = (...pathList: string[]) => path.resolve(CWD, 'node_modules', ...pathList.filter(i => i))

/**
 * 当前模块目录（current module directory）
 */
export const CMD = path.resolve(__dirname, '../../')

/**
 * 基于当前模块目录的相对路径
 * @param {String[]} pathList 路径
 */
export const cmdPath = (...pathList: string[]) => path.resolve(CMD, ...pathList.filter(i => i))

/**
 * 基于当前模块目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export const cmdNmPath = (...pathList: string[]) => path.resolve(CMD, 'node_modules', ...pathList.filter(i => i))

/**
 * 当前用户的根目录（current home directory）
 */
export const CHD = os.homedir()

/**
 * 基于当前用户根目录的相对路径
 * @param {String[]} pathList 路径
 */
export const chdPath = (...pathList: string[]) => path.resolve(CHD, ...pathList.filter(i => i))
