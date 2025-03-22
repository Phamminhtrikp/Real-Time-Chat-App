<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
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
            'message' => $this->message,
            'senderId' => $this->sender_id,
            'receiverId' => $this->receiver_id,
            'sender' => new UserResource($this->sender),
            'groupId' => $this->group_id,
            'attachments' => MessageAttachmentResource::collection($this->attachments),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
