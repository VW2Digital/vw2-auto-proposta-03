<?php

namespace App\Filament\Widgets;

use App\Filament\Pages\EditHero;
use App\Filament\Pages\EditHomePage;
use App\Filament\Pages\ProposalBoard;
use App\Filament\Resources\CaseStudies\CaseStudyResource;
use App\Filament\Resources\Projects\ProjectResource;
use Filament\Widgets\Widget;

class QuickLinks extends Widget
{
    protected static ?int $sort = 3;

    protected string $view = 'filament.widgets.quick-links';

    protected int | string | array $columnSpan = 1;

    public function getLinks(): array
    {
        return [
            ['label' => 'Montar a home', 'icon' => 'heroicon-o-home-modern', 'url' => EditHomePage::getUrl()],
            ['label' => 'Editar o hero', 'icon' => 'heroicon-o-sparkles', 'url' => EditHero::getUrl()],
            ['label' => 'Novo projeto', 'icon' => 'heroicon-o-rectangle-group', 'url' => ProjectResource::getUrl('create')],
            ['label' => 'Novo case', 'icon' => 'heroicon-o-trophy', 'url' => CaseStudyResource::getUrl('create')],
            ['label' => 'Quadro de propostas', 'icon' => 'heroicon-o-view-columns', 'url' => ProposalBoard::getUrl()],
            ['label' => 'Abrir o site', 'icon' => 'heroicon-o-arrow-top-right-on-square', 'url' => config('cms.frontend_url'), 'external' => true],
        ];
    }
}
