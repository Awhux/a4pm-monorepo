/**
 * Simple logger implementation for the database package
 * Provides standard logging functionality with configurable output formats
 */

// Log levels
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'success'

// Console color codes
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

// Log level specific config
const LOG_LEVEL_CONFIG: Record<LogLevel, { color: string; label: string }> = {
  error: { color: COLORS.red, label: 'ERROR' },
  warn: { color: COLORS.yellow, label: 'WARN' },
  info: { color: COLORS.green, label: 'INFO' },
  debug: { color: COLORS.magenta, label: 'DEBUG' },
  success: { color: COLORS.green, label: 'SUCCESS' },
}

const EMOJIS: Record<LogLevel, string> = {
  error: '❌',
  warn: '⚠️',
  info: '💡',
  debug: '🐛',
  success: '✅',
}

// Logger configuration
export interface LoggerOptions {
  context?: string
  useColors?: boolean
  useTimestamp?: boolean
  minLevel?: LogLevel
  useEmojis?: boolean
}

/**
 * Logger class for database operations
 */
export class Logger {
  private context: string
  private useColors: boolean
  private useTimestamp: boolean
  private minLevel: LogLevel
  private useEmojis: boolean

  constructor(options: LoggerOptions = {}) {
    this.context = options.context || 'Database'
    this.useColors = options.useColors ?? process.env.NODE_ENV !== 'production'
    this.useTimestamp = options.useTimestamp ?? true
    this.minLevel = options.minLevel || 'info'
    this.useEmojis = options.useEmojis ?? true
  }

  /**
   * Log an error message
   */
  public error(message: string | Error): void {
    this.log('error', message instanceof Error ? message.message : message)
    if (message instanceof Error && message.stack) {
      console.error(message.stack)
    }
  }

  /**
   * Log a warning message
   */
  public warn(message: string): void {
    this.log('warn', message)
  }

  /**
   * Log an info message
   */
  public info(message: string): void {
    this.log('info', message)
  }

  /**
   * Log a debug message
   */
  public debug(message: string): void {
    this.log('debug', message)
  }

  /**
   * Log a success message
   */
  public success(message: string): void {
    this.log('success', message)
  }

  /**
   * Format and output a log message
   */
  private log(level: LogLevel, message: string): void {
    // Skip logging if below minimum level
    if (!this.shouldLog(level)) {
      return
    }

    const config = LOG_LEVEL_CONFIG[level]
    const timestamp = this.useTimestamp ? this.getTimestamp() : ''

    if (!this.useColors) {
      console.log(
        `${timestamp}${config.label} [${this.context}] ${this.useEmojis ? EMOJIS[level] : ''} ${message}`,
      )
      return
    }

    console.log(
      `${COLORS.dim}${timestamp}${COLORS.reset} ${config.color}${config.label}${COLORS.reset} ${COLORS.cyan}[${this.context}]${COLORS.reset} ${this.useEmojis ? EMOJIS[level] : ''} ${message}`,
    )
  }

  /**
   * Determine if a log level should be output based on minimum level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'success']
    const minLevelIndex = levels.indexOf(this.minLevel)
    const levelIndex = levels.indexOf(level)

    return levelIndex <= minLevelIndex
  }

  /**
   * Get current timestamp in ISO format
   */
  private getTimestamp(): string {
    return `${new Date().toISOString()} `
  }
}

// Default logger instance
export const logger = new Logger()
