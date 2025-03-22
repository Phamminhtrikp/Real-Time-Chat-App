<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'avatarUrl' => $this->avatar ? Storage::url($this->avatar) : null,
            'name' => $this->name,
            'email' => $this->email,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'isAdmin' => (bool) $this->is_admin,
            'lastMessage' => $this->last_message,
            'lastMessageDate' => $this->last_message_date,
            // 'blockedAt' => $this->blocked_at,
        ];
    }
}
