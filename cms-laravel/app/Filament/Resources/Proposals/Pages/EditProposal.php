<?php

namespace App\Filament\Resources\Proposals\Pages;

use App\Filament\Resources\Proposals\ProposalResource;
use App\Models\Proposal;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\Width;

/** @property Proposal $record */
class EditProposal extends EditRecord
{
    protected static string $resource = ProposalResource::class;

    public function getSubheading(): ?string
    {
        return "{$this->record->full_name} · recebida ".$this->record->created_at?->diffForHumans();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('send')
                ->label('Enviar ao cliente')
                ->icon('heroicon-m-paper-airplane')
                ->visible(fn () => in_array($this->record->status, ['nova', 'em_analise'], true))
                ->requiresConfirmation()
                ->modalIcon('heroicon-o-paper-airplane')
                ->modalHeading('Enviar proposta ao cliente?')
                ->modalDescription('O status muda para “Enviada” e o link do cliente é gerado. Salve antes as alterações da proposta formal.')
                ->modalSubmitActionLabel('Gerar link e enviar')
                ->action(function () {
                    $this->save(shouldRedirect: false, shouldSendSavedNotification: false);
                    $this->record->update(['status' => 'enviada']);
                    $this->refreshFormData(['status', 'access_token', 'sent_at']);

                    Notification::make()->success()->title('Proposta enviada')
                        ->body('Link do cliente gerado. Copie na lateral ou mande pelo WhatsApp.')
                        ->send();
                }),

            Action::make('whatsapp')
                ->label('WhatsApp')
                ->icon('heroicon-m-chat-bubble-oval-left')
                ->color('success')
                ->url(fn () => ProposalResource::whatsappUrl($this->record->whatsapp, $this->record), shouldOpenInNewTab: true),

            ActionGroup::make([
                Action::make('client')->label('Abrir página do cliente')->icon('heroicon-m-arrow-top-right-on-square')
                    ->visible(fn () => filled($this->record->access_token))
                    ->url(fn () => $this->record->clientUrl(), shouldOpenInNewTab: true),
                Action::make('preview')->label('Pré-visualizar')->icon('heroicon-m-eye')
                    ->visible(fn () => filled($this->record->access_token))
                    ->modalHeading('Página do cliente')
                    ->modalWidth(Width::SevenExtraLarge)
                    ->slideOver()
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Fechar')
                    ->modalContent(fn () => view('filament.components.site-preview', ['url' => $this->record->clientUrl()])),
                ...ProposalResource::statusActions(),
                DeleteAction::make(),
            ])->icon('heroicon-m-ellipsis-vertical')->color('gray')->button()->label('Mais'),
        ];
    }

    protected function afterSave(): void
    {
        $this->refreshFormData(['access_token', 'sent_at']);
    }
}
