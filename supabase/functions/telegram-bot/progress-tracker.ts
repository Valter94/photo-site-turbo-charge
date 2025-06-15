
export class ProgressTracker {
  private operations = new Map<string, { 
    progress: number, 
    status: string, 
    startTime: number 
  }>();

  startOperation(operationId: string, status: string = 'Начало операции...') {
    this.operations.set(operationId, {
      progress: 0,
      status,
      startTime: Date.now()
    });
    console.log(`🚀 Операция запущена: ${operationId} - ${status}`);
  }

  updateProgress(operationId: string, progress: number, status?: string) {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    operation.progress = Math.min(100, Math.max(0, progress));
    if (status) operation.status = status;
    
    console.log(`📊 ${operationId}: ${operation.progress}% - ${operation.status}`);
  }

  completeOperation(operationId: string, status: string = 'Завершено') {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const duration = Date.now() - operation.startTime;
    console.log(`✅ Операция завершена: ${operationId} за ${duration}ms - ${status}`);
    
    this.operations.delete(operationId);
  }

  failOperation(operationId: string, error: string) {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const duration = Date.now() - operation.startTime;
    console.log(`❌ Операция провалена: ${operationId} за ${duration}ms - ${error}`);
    
    this.operations.delete(operationId);
  }

  getOperationStatus(operationId: string) {
    return this.operations.get(operationId);
  }

  getProgressBar(progress: number, width: number = 10): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return '▓'.repeat(filled) + '░'.repeat(empty);
  }

  formatProgressMessage(operationId: string): string | null {
    const operation = this.operations.get(operationId);
    if (!operation) return null;

    const progressBar = this.getProgressBar(operation.progress);
    const duration = Math.round((Date.now() - operation.startTime) / 1000);
    
    return `
🔄 <b>${operation.status}</b>

${progressBar} ${operation.progress}%
⏱ Время: ${duration}с
    `.trim();
  }
}

export const progressTracker = new ProgressTracker();
