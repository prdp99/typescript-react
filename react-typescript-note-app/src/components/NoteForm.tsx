import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuidv4 } from "uuid";
type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;
export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  tags = [],
  title = "",
  markdown = "",
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate("..");
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control required ref={titleRef} defaultValue={title} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tag">
                <Form.Label>Tags</Form.Label>
                <CreatableSelect
                  isMulti
                  onCreateOption={(label) => {
                    const newTag = { id: uuidv4(), label };
                    onAddTag(newTag);
                    setSelectedTags((prev) => [...prev, newTag]);
                  }}
                  options={availableTags.map((tag) => {
                    return { label: tag.label, value: tag.id };
                  })}
                  value={selectedTags.map((tag) => {
                    return {
                      label: tag.label,
                      value: tag.id,
                    };
                  })}
                  onChange={(tags) => {
                    setSelectedTags(
                      tags.map((tag) => {
                        return {
                          label: tag.label,
                          id: tag.value,
                        };
                      })
                    );
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="Markdown">
            <Form.Label>Body</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={15}
              ref={markdownRef}
              defaultValue={markdown}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit">Save</Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
